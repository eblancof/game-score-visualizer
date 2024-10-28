import React from 'react';

interface GameScoreProps {
  localScore: number | null;
  visitorScore: number | null;
  className?: string;
}

export const GameScore: React.FC<GameScoreProps> = ({ localScore, visitorScore, className = '' }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <span className="inline-block min-w-[2.5ch] text-center font-bold text-gray-800">
      {localScore ?? '-'}
    </span>
    <span className="font-bold text-gray-800">-</span>
    <span className="inline-block min-w-[2.5ch] text-center font-bold text-gray-800">
      {visitorScore ?? '-'}
    </span>
  </div>
);