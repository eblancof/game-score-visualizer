import React from 'react';
import { GameData } from '../../types/gameData';
import { TextColors } from '../../hooks/useTextColors';
import { useTextColors } from '../../hooks/useTextColors';

interface GameInfoProps {
  game: GameData;
  className?: string;
  textColors?: TextColors;
}

export const GameInfo: React.FC<GameInfoProps> = ({ 
  game, 
  className = '',
  textColors
}) => {
  const { fonts } = useTextColors();
  
  return (
    <div className={`text-center ${className}`}>
      <span style={{ 
        color: textColors?.dateTime,
        fontFamily: fonts.dateTime.family,
        fontSize: `${fonts.dateTime.size}px`
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
        fontSize: `${fonts.competition.size}px`
      }}>
        {game.competition.name.toUpperCase()}
      </span>
    </div>
  );
};