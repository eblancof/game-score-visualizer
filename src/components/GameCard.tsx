import React from 'react';
import { GameData } from '../types/gameData';
import CornerLogos from './CornerLogos';

interface GameCardProps {
  games: GameData[];
}

export const GameCard: React.FC<GameCardProps> = ({ games }) => {
  const maxGames = Math.min(games.length, 6);
  const gamesList = games.slice(0, maxGames);

  return (
    <div className="game-card w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-full h-full p-[3%] flex flex-col justify-between">
        <CornerLogos className="h-[10%]" />

        <div className="flex-1 flex flex-col justify-around py-[2%]">
          {gamesList.map((game) => (
            <div
              key={game.id}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-center mb-[1%] text-[1.6vw] font-medium text-gray-700 mx-auto">
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
                <span style={{ color: 'maroon' }}>
                  {game.competition.name.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between w-full px-[3%]">
                <div className="flex items-center w-[38%] gap-[3%]">
                  <img
                    src={game.localTeam.shieldUrl}
                    alt={game.localTeam.club.name}
                    className="w-[15%] aspect-square rounded-full object-cover"
                  />
                  <div className="font-semibold text-center flex-1 text-[1.8vw]">
                    {game.localTeam.club.name.toUpperCase()}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 px-[2%] py-[0.5%] bg-gray-100 rounded-lg text-[2vw] font-bold w-[20%] mx-[2%]">
                  <span className="inline-block min-w-[2ch] text-center">{game.localScore ?? '-'}</span>
                  <span>-</span>
                  <span className="inline-block min-w-[2ch] text-center">{game.visitorScore ?? '-'}</span>
                </div>

                <div className="flex items-center justify-end w-[38%] gap-[3%]">
                  <div className="font-semibold text-center flex-1 text-[1.8vw]">
                    {game.visitorTeam.club.name.toUpperCase()}
                  </div>
                  <img
                    src={game.visitorTeam.shieldUrl}
                    alt={game.visitorTeam.club.name}
                    className="w-[15%] aspect-square rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <CornerLogos className="h-[10%]" />
      </div>
    </div>
  );
};