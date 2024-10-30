import React, { useState } from 'react';
import { GameData } from '../types/gameData';
import { fetchGameData } from '../utils/api';
import SingleGameCard from '../components/SingleGameCard';
import SingleGamePicker from '../components/SingleGamePicker';
import SingleGameExport from '../components/SingleGameExport';
import { useLogos } from '../hooks/useLogos';
import { useTextColors } from '../hooks/useTextColors';
import ColorPicker from '../components/ColorPicker';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SingleGameVisualizer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [games, setGames] = useState<GameData[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { logos } = useLogos();
  const { textColors, updateTextColor, resetColors } = useTextColors();

  const handleDateSelect = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const data = await fetchGameData(date, endDate);
      setGames(data);
      setSelectedGame(null);
    } catch (err) {
      setError('Failed to fetch games. Please try again.');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
    setSelectedDate(date);
  };

  const handleBackToList = () => {
    setSelectedGame(null);
  };

  return (
    <div>
      {!selectedGame ? (
        <SingleGamePicker
          onDateSelect={handleDateSelect}
          games={games}
          selectedGame={selectedGame}
          onGameSelect={setSelectedGame}
          loading={loading}
          error={error}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={handleBackToList}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to game list
            </Button>
            <SingleGameExport />
          </div>

          <ColorPicker
            colors={textColors}
            onColorChange={updateTextColor}
            onReset={resetColors}
          />

          <SingleGameCard 
            game={selectedGame} 
            logos={logos}
            textColors={textColors}
          />
        </div>
      )}
    </div>
  );
};

export default SingleGameVisualizer;