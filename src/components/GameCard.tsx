import React from 'react';
import { GameData } from '../types/gameData';
import CornerLogos from './CornerLogos';
import { Logo } from '../hooks/useLogos';

interface GameCardProps {
  games: GameData[];
  logos: Logo[];
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
    return 'https://placehold.co/57x57/png?text=Club';
  }
  return url;
};

export const GameCard: React.FC<GameCardProps> = ({ games, logos }) => {
  const maxGames = Math.min(games.length, 6);
  const gamesList = games.slice(0, maxGames);

  return (
    <div className="game-card w-full h-full bg-[#ffffff] rounded-lg shadow-lg overflow-hidden">
      <div className="w-full h-full p-[3%] flex flex-col justify-between" style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <CornerLogos className="h-[10%]" logos={logos} position="top" />

        <div className="flex-1 flex flex-col justify-around py-[2%]">
          {gamesList.map((game) => (
            <div
              key={game.id}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-center mb-[1%] mx-auto text-gray-800" style={{ fontSize: 'min(1.68vw, 18.14px)' }}>
                {new Date(game.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                -{' '}
                {new Date(game.date).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                :{' '}
                <span className="text-red-800 font-medium">
                  {game.competition.name.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between w-full px-[3%]">
                <div className="flex items-center w-[38%] gap-[3%]">
                  <img
                    src={getValidImageUrl(game.localTeam.shieldUrl)}
                    alt={game.localTeam.club.name}
                    className="rounded-full object-cover shadow-sm ring-1 ring-black/5"
                    style={{ width: 'min(15.75%, 57px)', aspectRatio: '1/1' }}
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/57x57/png?text=Logo';
                    }}
                  />
                  <div className="font-semibold text-center flex-1 text-gray-800" style={{ fontSize: 'min(1.89vw, 20.41px)' }}>
                    {game.localTeam.club.name.toUpperCase()}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 px-[2%] py-[1.5%] bg-gray-100 rounded-lg w-[15%] mx-[2%] shadow-sm">
                  <span className="inline-block min-w-[2.5ch] text-center font-bold text-gray-800" style={{ fontSize: 'min(2.1vw, 22.68px)', lineHeight: '1.2' }}>
                    {game.localScore ?? '-'}
                  </span>
                  <span className="font-bold text-gray-800" style={{ fontSize: 'min(2.1vw, 22.68px)', lineHeight: '1.2' }}>-</span>
                  <span className="inline-block min-w-[2.5ch] text-center font-bold text-gray-800" style={{ fontSize: 'min(2.1vw, 22.68px)', lineHeight: '1.2' }}>
                    {game.visitorScore ?? '-'}
                  </span>
                </div>

                <div className="flex items-center justify-end w-[38%] gap-[3%]">
                  <div className="font-semibold text-center flex-1 text-gray-800" style={{ fontSize: 'min(1.89vw, 20.41px)' }}>
                    {game.visitorTeam.club.name.toUpperCase()}
                  </div>
                  <img
                    src={getValidImageUrl(game.visitorTeam.shieldUrl)}
                    alt={game.visitorTeam.club.name}
                    className="rounded-full object-cover shadow-sm ring-1 ring-black/5"
                    style={{ width: 'min(15.75%, 57px)', aspectRatio: '1/1' }}
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/57x57/png?text=Logo';
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <CornerLogos className="h-[10%]" logos={logos} position="bottom" />
      </div>
    </div>
  );
};