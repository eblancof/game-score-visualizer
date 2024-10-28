import React, { useRef, useEffect, useState } from 'react';
import { GameData } from '../types/gameData';
import { Logo } from '../hooks/useLogos';
import CornerLogos from './CornerLogos';
import { GameMatch } from './game/GameMatch';

interface GameCardProps {
  games: GameData[];
  logos: Logo[];
}

export const GameCard: React.FC<GameCardProps> = ({ games, logos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const maxGames = Math.min(games.length, 6);
  const gamesList = games.slice(0, maxGames);

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
    <div className="game-card w-full h-full bg-[#ffffff] rounded-lg shadow-lg overflow-hidden" ref={containerRef}>
      <div className="w-full h-full p-[3%] flex flex-col justify-between" style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <CornerLogos 
          className="h-[10%]" 
          logos={logos} 
          section="top"
          containerWidth={containerWidth}
        />

        <div className="flex-1 flex flex-col justify-around py-[2%]">
          {gamesList.map((game) => (
            <GameMatch key={game.id} game={game} />
          ))}
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