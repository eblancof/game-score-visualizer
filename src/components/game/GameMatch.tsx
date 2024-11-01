import React from 'react';
import { GameData } from '../../types/gameData';
import { TeamDisplay } from './TeamDisplay';
import { GameScore } from './GameScore';
import { GameInfo } from './GameInfo';
import { TextColors } from '../../hooks/useTextColors';

interface GameMatchProps {
  game: GameData;
  className?: string;
  textColors?: TextColors;
}

export const GameMatch: React.FC<GameMatchProps> = ({ 
  game, 
  className = '',
  textColors
}) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <GameInfo 
      game={game} 
      className="mb-[10.8px] mx-auto" 
      textColors={textColors}
    />

    <div className="flex items-center justify-between w-full px-[32.4px]">
      <TeamDisplay 
        team={game.localTeam} 
        alignment="left" 
        className="w-[410.4px]"
        textColors={textColors}
        type="local"
      />

      <GameScore
        localScore={game.localScore}
        visitorScore={game.visitorScore}
        className="px-[21.6px] py-[16.2px] bg-gray-100 rounded-lg w-[162px] mx-[21.6px] shadow-sm"
        textColors={textColors}
      />

      <TeamDisplay 
        team={game.visitorTeam} 
        alignment="right" 
        className="w-[410.4px]"
        textColors={textColors}
        type="visitor"
      />
    </div>
  </div>
);