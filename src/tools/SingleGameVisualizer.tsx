import React, { useState } from 'react';
import { GameData } from '../types/gameData';
import { fetchGameData } from '../utils/api';
import SingleGameCard from '../components/SingleGameCard';
import SingleGamePicker from '../components/SingleGamePicker';
import SingleGameExport from '../components/SingleGameExport';

const SingleGameVisualizer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [games, setGames] = useState<GameData[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-white p-4">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-8 text-center">
          Single Game Visualizer
        </h1>

        <SingleGamePicker
          onDateSelect={handleDateSelect}
          games={games}
          selectedGame={selectedGame}
          onGameSelect={setSelectedGame}
          loading={loading}
          error={error}
        />

        {selectedGame && (
          <div className="mt-8 space-y-6">
            <SingleGameExport />
            <SingleGameCard game={selectedGame} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleGameVisualizer;