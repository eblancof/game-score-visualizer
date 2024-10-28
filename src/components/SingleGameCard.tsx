import React, { useRef, useEffect, useState } from 'react';
import { GameData } from '../types/gameData';
import { Logo } from '../hooks/useLogos';
import CornerLogos from './CornerLogos';
import { TeamLogo } from './game/TeamLogo';
import { GameScore } from './game/GameScore';

interface SingleGameCardProps {
  game: GameData;
  logos: Logo[];
}

export const SingleGameCard: React.FC<SingleGameCardProps> = ({ game, logos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="game-card w-full bg-white rounded-lg shadow-lg overflow-hidden mx-auto" style={{ maxWidth: '1080px', aspectRatio: '1/1' }} ref={containerRef}>
      <div className="w-full h-full p-[5%] flex flex-col justify-between">
        <CornerLogos 
          className="h-[10%]" 
          logos={logos} 
          section="top"
          containerWidth={containerWidth}
        />

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
              <TeamLogo team={game.localTeam} className="w-[120px] h-[120px] ring-2 ring-black/10" />
              <h3 className="text-xl font-bold text-center text-gray-800">
                {game.localTeam.club.name.toUpperCase()}
              </h3>
            </div>

            <GameScore
              localScore={game.localScore}
              visitorScore={game.visitorScore}
              className="px-6 py-4 bg-gray-100 rounded-2xl shadow-inner [&_span]:text-4xl"
            />

            <div className="flex flex-col items-center gap-4 flex-1">
              <TeamLogo team={game.visitorTeam} className="w-[120px] h-[120px] ring-2 ring-black/10" />
              <h3 className="text-xl font-bold text-center text-gray-800">
                {game.visitorTeam.club.name.toUpperCase()}
              </h3>
            </div>
          </div>
        </div>

        <CornerLogos 
          className="h-[10%]" 
          logos={logos} 
          section="bottom"
          containerWidth={containerWidth}
        />
      </div>
    </div>
  );
};

export default SingleGameCard;