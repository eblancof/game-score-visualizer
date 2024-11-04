import React, { useState, useCallback } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import { fetchGameData } from '../utils/api';
import { GameData } from '../types/gameData';
import { generateCards } from '../utils/cardGenerator';
import GameSlider from '../components/GameSlider';
import GameList from '../components/GameList';
import ViewToggle from '../components/ViewToggle';
import ColorPicker from '../components/CollapsibleBar';
import FloatingTextButton from '../components/FloatingTextButton';
import TextElementControls from '../components/TextElementControls';
import { useLogos } from '../hooks/useLogos';
import { useTextColors } from '../hooks/useTextColors';
import { useBackgrounds } from '../hooks/useBackgrounds';
import { useShieldSize } from '../hooks/useShieldSize';
import { useTextElements } from '../hooks/useTextElements';

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
  const { shieldSize } = useShieldSize();
  const { elements, addElement, updateElement, removeElement } = useTextElements();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const fetchGames = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGameData(start, end);
      setGames(data);
      const generatedCards = generateCards(data);
      setCards(generatedCards);

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

  const handleAddText = () => {
    const newElementId = addElement();
    setSelectedElement(newElementId);
  };

  const handleTextSelect = (id: string, position: { x: number; y: number }) => {
    setSelectedElement(id);
    setMenuPosition(position);
  };

  const handleCloseMenu = () => {
    setSelectedElement(null);
    setMenuPosition(null);
  };

  return (
    <div>
      <DateRangePicker onDateChange={handleDateChange} />
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <ViewToggle view={view} onViewChange={setView} />
        {view === 'slider' && <GameSlider.ExportOptions />}
      </div>

      {view === 'slider' && (
        <>
          <ColorPicker
            colors={textColors}
            onColorChange={updateTextColor}
            onReset={resetColors}
          />
          <FloatingTextButton onClick={handleAddText} />
          {selectedElement && menuPosition && (
            <TextElementControls
              element={elements.find(e => e.id === selectedElement)!}
              onUpdate={updateElement}
              onRemove={removeElement}
              onClose={handleCloseMenu}
              position={menuPosition}
            />
          )}
        </>
      )}
      
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground text-center">Loading...</p>
      ) : view === 'slider' ? (
        <GameSlider 
          cards={cards} 
          logos={logos} 
          textColors={textColors}
          textElements={elements}
          onTextElementUpdate={updateElement}
          onTextElementSelect={handleTextSelect}
          selectedTextElement={selectedElement}
          key={`shield-size-${shieldSize}`}
        />
      ) : (
        <GameList cards={cards} />
      )}
    </div>
  );
};

export default GameScoreVisualizer;