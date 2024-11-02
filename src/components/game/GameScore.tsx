import React from 'react';
import { useTextColors } from '../../hooks/useTextColors';

interface GameScoreProps {
  localScore: number | null;
  visitorScore: number | null;
  className?: string;
}

export const GameScore: React.FC<GameScoreProps> = ({ 
  localScore, 
  visitorScore, 
  className = '',
}) => {
  const { textColors, fonts } = useTextColors();
  const scoreStyle = {
    color: textColors?.score,
    fontFamily: fonts.score.family,
    fontSize: `${fonts.score.size}px`
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span 
        className="inline-block min-w-[2.5ch] text-center font-bold"
        style={scoreStyle}
      >
        {localScore ?? '-'}
      </span>
      <span 
        className="font-bold"
        style={scoreStyle}
      >
        -
      </span>
      <span 
        className="inline-block min-w-[2.5ch] text-center font-bold"
        style={scoreStyle}
      >
        {visitorScore ?? '-'}
      </span>
    </div>
  );
};