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
  const { textColors, fonts, scoreBackground } = useTextColors();
  const scoreStyle = {
    color: textColors?.score,
    fontFamily: fonts.score.family,
    fontSize: `${fonts.score.size}px`,
    fontWeight: fonts.score.weight,
    textShadow: fonts.score.textShadow,
  };

  // Convert background color and opacity to rgba
  const backgroundColor = scoreBackground.color && scoreBackground.opacity
    ? `rgba(${hexToRgb(scoreBackground.color)}, ${scoreBackground.opacity})`
    : scoreBackground.color;

  return (
    <div 
      className={`flex items-center justify-center gap-2 ${className}`}
      style={{
        backgroundColor
      }}
    >
      <div>
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
    </div>
  );
};

// Helper function to convert hex to rgb
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0,0,0';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
};