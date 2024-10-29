import React from 'react';
import { TextColors } from '../../hooks/useTextColors';

interface GameScoreProps {
  localScore: number | null;
  visitorScore: number | null;
  className?: string;
  textColors?: TextColors;
}

export const GameScore: React.FC<GameScoreProps> = ({ 
  localScore, 
  visitorScore, 
  className = '',
  textColors
}) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <span 
      className="inline-block min-w-[2.5ch] text-center font-bold"
      style={{ color: textColors?.score }}
    >
      {localScore ?? '-'}
    </span>
    <span 
      className="font-bold"
      style={{ color: textColors?.score }}
    >
      -
    </span>
    <span 
      className="inline-block min-w-[2.5ch] text-center font-bold"
      style={{ color: textColors?.score }}
    >
      {visitorScore ?? '-'}
    </span>
  </div>
);