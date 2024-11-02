import React, { useRef, useEffect, useState } from 'react';
import { GameData } from '../types/gameData';
import { Logo } from '../hooks/useLogos';
import { useBackgrounds } from '../hooks/useBackgrounds';
import { useTextColors } from '../hooks/useTextColors';
import CornerLogos from './CornerLogos';
import { GameMatch } from './game/GameMatch';

interface GameCardProps {
  games: GameData[];
  logos: Logo[];
}

export const GameCard: React.FC<GameCardProps> = ({ 
  games, 
  logos,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const maxGames = Math.min(games.length, 6);
  const gamesList = games.slice(0, maxGames);
  const { getSelectedBackground } = useBackgrounds();
  const selectedBackground = getSelectedBackground();
  const { textColors } = useTextColors();

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / 1080); // Base size is 1080px
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div 
      className="game-card relative w-full"
      style={{ aspectRatio: '1/1' }}
      ref={containerRef}
    >
      <div 
        className="absolute inset-0 origin-top-left"
        style={{ 
          width: '1080px',
          height: '1080px',
          transform: `scale(${scale})`,
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        {selectedBackground && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${selectedBackground.url})`,
              opacity: selectedBackground.opacity
            }} 
          />
        )}
        
        <div className="w-full h-full p-[32.4px] flex flex-col justify-between relative">
          <CornerLogos 
            className="h-[108px]"
            logos={logos} 
            section="top"
            containerWidth={1080}
          />

          <div className="flex-1 flex flex-col justify-around py-[21.6px]">
            {gamesList.map((game) => (
              <GameMatch 
                key={game.id} 
                game={game}
              />
            ))}
          </div>

          <CornerLogos 
            className="h-[108px]"
            logos={logos} 
            section="bottom"
            containerWidth={1080}
          />
        </div>
      </div>
    </div>
  );
};