import React from 'react';
import { GameData } from '../types/gameData';

interface SingleGamePickerProps {
  onDateSelect: (date: Date) => void;
  games: GameData[];
  selectedGame: GameData | null;
  onGameSelect: (game: GameData) => void;
  loading: boolean;
  error: string | null;
}

const SingleGamePicker: React.FC<SingleGamePickerProps> = ({
  onDateSelect,
  games,
  selectedGame,
  onGameSelect,
  loading,
  error
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Select Date</label>
          <input
            type="date"
            onChange={(e) => onDateSelect(new Date(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {loading ? (
          <p className="text-gray-600">Loading games...</p>
        ) : games.length > 0 ? (
          <div className="space-y-3">
            <label className="block text-gray-700 mb-2 font-medium">Select Game</label>
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => onGameSelect(game)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  selectedGame?.id === game.id
                    ? 'bg-purple-100 shadow-md'
                    : 'bg-white hover:bg-purple-50'
                } shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{game.localTeam.club.name}</p>
                    <p className="text-sm text-gray-500">vs</p>
                    <p className="font-medium">{game.visitorTeam.club.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(game.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-purple-600 font-medium">
                      {game.competition.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : games.length === 0 && !loading ? (
          <p className="text-gray-600">No games found for this date</p>
        ) : null}
      </div>
    </div>
  );
};

export default SingleGamePicker;