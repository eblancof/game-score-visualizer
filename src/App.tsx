import React, { useState, useEffect } from 'react';
import DateRangePicker from './components/DateRangePicker';
import { fetchGameData } from './utils/api';
import { GameData } from './types/gameData';
import { generateCards } from './utils/cardGenerator';
import GameSlider from './components/GameSlider';
import GameList from './components/GameList';
import ViewToggle from './components/ViewToggle';

const App: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [games, setGames] = useState<GameData[]>([]);
  const [cards, setCards] = useState<GameData[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'slider' | 'list'>('slider');

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGameData(startDate, endDate);
        setGames(data);
        const generatedCards = generateCards(data);
        setCards(generatedCards);
      } catch (err) {
        setError('Failed to fetch game data. Please try again.');
        console.error('Error fetching game data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [startDate, endDate]);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-white p-4">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-8 text-center">
          Basketball Results Instagram Post Generator
        </h1>
        <DateRangePicker onDateChange={handleDateChange} />
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <ViewToggle view={view} onViewChange={setView} />
          {view === 'slider' && <GameSlider.ExportOptions />}
        </div>
        
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : view === 'slider' ? (
          <GameSlider cards={cards} />
        ) : (
          <GameList cards={cards} />
        )}
      </div>
    </div>
  );
};

export default App;