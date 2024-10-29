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
      className="mb-[1%] mx-auto" 
      textColors={textColors}
    />

    <div className="flex items-center justify-between w-full px-[3%]">
      <TeamDisplay 
        team={game.localTeam} 
        alignment="left" 
        className="w-[38%]"
        textColors={textColors}
      />

      <GameScore
        localScore={game.localScore}
        visitorScore={game.visitorScore}
        className="px-[2%] py-[1.5%] bg-gray-100 rounded-lg w-[15%] mx-[2%] shadow-sm"
        textColors={textColors}
      />

      <TeamDisplay 
        team={game.visitorTeam} 
        alignment="right" 
        className="w-[38%]"
        textColors={textColors}
      />
    </div>
  </div>
);