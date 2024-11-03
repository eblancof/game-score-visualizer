import React from 'react';
import { GameData } from '../../types/gameData';
import { useTextColors } from '../../hooks/useTextColors';

interface GameInfoProps {
  game: GameData;
  className?: string;
}

export const GameInfo: React.FC<GameInfoProps> = ({ 
  game, 
  className = '',
}) => {
  const { textColors, fonts } = useTextColors();
  
  return (
    <div className={`text-center ${className}`}>
      <span style={{ 
        color: textColors?.dateTime,
        fontFamily: fonts.dateTime.family,
        fontWeight: fonts.dateTime.weight,
        fontSize: `${fonts.dateTime.size}px`,
        textShadow: fonts.dateTime.textShadow
      }}>
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
      </span>
      <span style={{ 
        color: textColors?.competition,
        fontFamily: fonts.competition.family,
        fontWeight: fonts.competition.weight,
        fontSize: `${fonts.competition.size}px`,
        textShadow: fonts.competition.textShadow
      }}>
        {game.competition.name.toUpperCase()}
      </span>
    </div>
  );
};