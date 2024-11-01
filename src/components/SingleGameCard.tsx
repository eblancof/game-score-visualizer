import React, { useRef, useEffect, useState } from 'react';
import { GameData } from '../types/gameData';
import { Logo } from '../hooks/useLogos';
import { useBackgrounds } from '../hooks/useBackgrounds';
import { TextColors } from '../hooks/useTextColors';
import { useTextColors } from '../hooks/useTextColors';
import CornerLogos from './CornerLogos';
import { TeamLogo } from './game/TeamLogo';
import { GameScore } from './game/GameScore';

interface SingleGameCardProps {
  game: GameData;
  logos: Logo[];
  textColors?: TextColors;
}

const SingleGameCard: React.FC<SingleGameCardProps> = ({ 
  game, 
  logos,
  textColors
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { getSelectedBackground } = useBackgrounds();
  const selectedBackground = getSelectedBackground();
  const { fonts } = useTextColors();

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / 1080);
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

        <div className="w-full h-full p-[54px] flex flex-col justify-between relative">
          <CornerLogos 
            className="h-[108px]"
            logos={logos} 
            section="top"
            containerWidth={1080}
          />

          <div className="flex-1 flex flex-col justify-center items-center gap-[86.4px]">
            <div className="text-center space-y-[21.6px]">
              <h2 
                style={{ 
                  color: textColors?.competition,
                  fontFamily: fonts.competition.family,
                  fontSize: `${fonts.competition.size}px`
                }}
              >
                {game.competition.name.toUpperCase()}
              </h2>
              <p 
                style={{ 
                  color: textColors?.dateTime,
                  fontFamily: fonts.dateTime.family,
                  fontSize: `${fonts.dateTime.size}px`
                }}
              >
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

            <div className="flex items-center justify-between w-full px-[54px] gap-[64.8px]">
              <div className="flex flex-col items-center gap-[43.2px] flex-1">
                <TeamLogo 
                  team={game.localTeam} 
                  className="ring-2 ring-black/10" 
                  type="local"
                />
                <h3 
                  style={{ 
                    color: textColors?.teamName,
                    fontFamily: fonts.teamName.family,
                    fontSize: `${fonts.teamName.size}px`
                  }}
                >
                  {game.localTeam.club.name.toUpperCase()}
                </h3>
              </div>

              <GameScore
                localScore={game.localScore}
                visitorScore={game.visitorScore}
                className="px-[64.8px] py-[43.2px] bg-gray-100 rounded-2xl shadow-inner"
                textColors={textColors}
              />

              <div className="flex flex-col items-center gap-[43.2px] flex-1">
                <TeamLogo 
                  team={game.visitorTeam} 
                  className="ring-2 ring-black/10" 
                  type="visitor"
                />
                <h3 
                  style={{ 
                    color: textColors?.teamName,
                    fontFamily: fonts.teamName.family,
                    fontSize: `${fonts.teamName.size}px`
                  }}
                >
                  {game.visitorTeam.club.name.toUpperCase()}
                </h3>
              </div>
            </div>
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

export default SingleGameCard;