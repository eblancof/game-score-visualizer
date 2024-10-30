import React, { useState, useCallback } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import { fetchGameData } from '../utils/api';
import { GameData } from '../types/gameData';
import { generateCards } from '../utils/cardGenerator';
import GameSlider from '../components/GameSlider';
import GameList from '../components/GameList';
import ViewToggle from '../components/ViewToggle';
import ColorPicker from '../components/ColorPicker';
import { useLogos } from '../hooks/useLogos';
import { useTextColors } from '../hooks/useTextColors';
import { useBackgrounds } from '../hooks/useBackgrounds';

const GameScoreVisualizer: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [games, setGames] = useState<GameData[]>([]);
  const [cards, setCards] = useState<GameData[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'slider' | 'list'>('slider');
  const { logos } = useLogos();
  const { textColors, updateTextColor, resetColors } = useTextColors();
  const { getSelectedBackground } = useBackgrounds();

  const fetchGames = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGameData(start, end);
      setGames(data);
      const generatedCards = generateCards(data);
      setCards(generatedCards);

      // Generate new color palette based on background
      const background = getSelectedBackground();
      if (background) {
        await resetColors();
      }
    } catch (err) {
      setError('Failed to fetch game data. Please try again.');
      console.error('Error fetching game data:', err);
    } finally {
      setLoading(false);
    }
  }, [getSelectedBackground, resetColors]);

  const handleDateChange = useCallback((start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    fetchGames(start, end);
  }, [fetchGames]);

  return (
    <div>
      <DateRangePicker onDateChange={handleDateChange} />
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <ViewToggle view={view} onViewChange={setView} />
        {view === 'slider' && <GameSlider.ExportOptions />}
      </div>

      {view === 'slider' && (
        <ColorPicker
          colors={textColors}
          onColorChange={updateTextColor}
          onReset={resetColors}
        />
      )}
      
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground text-center">Loading...</p>
      ) : view === 'slider' ? (
        <GameSlider cards={cards} logos={logos} textColors={textColors} />
      ) : (
        <GameList cards={cards} />
      )}
    </div>
  );
};

export default GameScoreVisualizer;