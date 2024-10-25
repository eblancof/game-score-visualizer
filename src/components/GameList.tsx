import React from 'react';
import { GameData } from '../types/gameData';

interface GameListProps {
  cards: GameData[][];
}

const GameList: React.FC<GameListProps> = ({ cards }) => {
  // Flatten all games from all cards into a single array
  const allGames = cards.flat();

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-4">
      {allGames.map((game) => (
        <div
          key={game.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="text-sm text-gray-600 mb-2">
            {new Date(game.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}{' '}
            -{' '}
            {new Date(game.date).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          
          <div className="text-sm font-medium text-red-800 mb-3">
            {game.competition.name.toUpperCase()}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-[38%]">
              <img
                src={game.localTeam.shieldUrl}
                alt={game.localTeam.club.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">{game.localTeam.club.name}</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-1 bg-gray-100 rounded-lg mx-4">
              <span className="font-bold text-lg">
                {game.localScore ?? '-'}
              </span>
              <span className="text-gray-400">-</span>
              <span className="font-bold text-lg">
                {game.visitorScore ?? '-'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-[38%] justify-end">
              <span className="font-medium">{game.visitorTeam.club.name}</span>
              <img
                src={game.visitorTeam.shieldUrl}
                alt={game.visitorTeam.club.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;