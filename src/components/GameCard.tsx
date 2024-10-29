import React, { useRef, useEffect, useState } from 'react';
import { GameData } from '../types/gameData';
import { Logo } from '../hooks/useLogos';
import { useBackgrounds } from '../hooks/useBackgrounds';
import { TextColors } from '../hooks/useTextColors';
import CornerLogos from './CornerLogos';
import { GameMatch } from './game/GameMatch';

interface GameCardProps {
  games: GameData[];
  logos: Logo[];
  textColors?: TextColors;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  games, 
  logos,
  textColors
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const maxGames = Math.min(games.length, 6);
  const gamesList = games.slice(0, maxGames);
  const { getSelectedBackground } = useBackgrounds();
  const selectedBackground = getSelectedBackground();

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
    <div className="game-card w-full h-full bg-[#ffffff] rounded-lg shadow-lg overflow-hidden relative" ref={containerRef}>
      {selectedBackground && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${selectedBackground.url})`,
            opacity: selectedBackground.opacity
          }} 
        />
      )}
      <div className="w-full h-full p-[3%] flex flex-col justify-between relative" style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <CornerLogos 
          className="h-[10%]" 
          logos={logos} 
          section="top"
          containerWidth={containerWidth}
        />

        <div className="flex-1 flex flex-col justify-around py-[2%]">
          {gamesList.map((game) => (
            <GameMatch 
              key={game.id} 
              game={game}
              textColors={textColors}
            />
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