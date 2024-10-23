import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import DateRangePicker from './components/DateRangePicker';
import { fetchGameData } from './utils/api';
import { GameData } from './types/gameData';
import { generateCards } from './utils/cardGenerator';
import { downloadCards } from './utils/downloadCards';
import GameSlider from './components/GameSlider';

const App: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [games, setGames] = useState<GameData[]>([]);
  const [cards, setCards] = useState<GameData[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGameData(startDate, endDate);
        setGames(data);
        const generatedCards = generateCards(data);
        setCards(generatedCards);
        console.log('Generated cards:', generatedCards); // Debug log
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

  const handleDownload = async () => {
    try {
      await downloadCards(cards);
    } catch (err) {
      setError('Failed to download cards. Please try again.');
      console.error('Error downloading cards:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">Basketball Results Instagram Post Generator</h1>
        <DateRangePicker onDateChange={handleDateChange} />
        <button
          onClick={handleDownload}
          disabled={loading || cards.length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center mt-4 mb-4 sm:mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="mr-2" />
          Download Cards
        </button>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <GameSlider cards={cards} />
        )}
      </div>
    </div>
  );
};

export default App;