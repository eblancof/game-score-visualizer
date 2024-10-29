import React from 'react';
import { GameData } from '../../types/gameData';
import { TextColors } from '../../hooks/useTextColors';

interface GameInfoProps {
  game: GameData;
  className?: string;
  textColors?: TextColors;
}

export const GameInfo: React.FC<GameInfoProps> = ({ 
  game, 
  className = '',
  textColors
}) => (
  <div className={`text-center ${className}`} style={{ fontSize: 'min(1.68vw, 18.14px)' }}>
    <span style={{ color: textColors?.dateTime }}>
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
    <span style={{ color: textColors?.competition }}>
      {game.competition.name.toUpperCase()}
    </span>
  </div>
);