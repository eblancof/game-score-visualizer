import React from 'react';
import { GameData } from '../types/gameData';
import CornerLogos from './CornerLogos';

interface SingleGameCardProps {
  game: GameData;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getValidImageUrl = (url: string | undefined): string => {
  if (!url || !isValidUrl(url)) {
    return 'https://placehold.co/120x120/png?text=Club';
  }
  return url;
};

export const SingleGameCard: React.FC<SingleGameCardProps> = ({ game }) => {
  return (
    <div className="game-card w-full bg-white rounded-lg shadow-lg overflow-hidden mx-auto" style={{ maxWidth: '1080px', aspectRatio: '1/1' }}>
      <div className="w-full h-full p-[5%] flex flex-col justify-between">
        <CornerLogos className="h-[10%]" />

        <div className="flex-1 flex flex-col justify-center items-center gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-purple-800">
              {game.competition.name.toUpperCase()}
            </h2>
            <p className="text-gray-600">
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
            </p>
          </div>

          <div className="flex items-center justify-between w-full px-[5%] gap-6">
            <div className="flex flex-col items-center gap-4 flex-1">
              <img
                src={getValidImageUrl(game.localTeam.shieldUrl)}
                alt={game.localTeam.club.name}
                className="w-[120px] h-[120px] rounded-full object-cover shadow-lg ring-2 ring-black/10"
              />
              <h3 className="text-xl font-bold text-center text-gray-800">
                {game.localTeam.club.name.toUpperCase()}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gray-100 rounded-2xl shadow-inner">
              <span className="text-4xl font-bold text-gray-800 min-w-[3ch] text-center">
                {game.localScore ?? '-'}
              </span>
              <span className="text-4xl font-bold text-gray-400">-</span>
              <span className="text-4xl font-bold text-gray-800 min-w-[3ch] text-center">
                {game.visitorScore ?? '-'}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4 flex-1">
              <img
                src={getValidImageUrl(game.visitorTeam.shieldUrl)}
                alt={game.visitorTeam.club.name}
                className="w-[120px] h-[120px] rounded-full object-cover shadow-lg ring-2 ring-black/10"
              />
              <h3 className="text-xl font-bold text-center text-gray-800">
                {game.visitorTeam.club.name.toUpperCase()}
              </h3>
            </div>
          </div>
        </div>

        <CornerLogos className="h-[10%]" />
      </div>
    </div>
  );
};

export default SingleGameCard;