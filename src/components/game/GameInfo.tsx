import React from 'react';
import { GameData } from '../../types/gameData';

interface GameInfoProps {
  game: GameData;
  className?: string;
}

export const GameInfo: React.FC<GameInfoProps> = ({ game, className = '' }) => (
  <div className={`text-center ${className}`} style={{ fontSize: 'min(1.68vw, 18.14px)' }}>
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
);