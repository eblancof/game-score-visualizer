import React from 'react';
import { GameData } from '../../types/gameData';
import { TeamDisplay } from './TeamDisplay';
import { GameScore } from './GameScore';
import { GameInfo } from './GameInfo';

interface GameMatchProps {
  game: GameData;
  className?: string;
}

export const GameMatch: React.FC<GameMatchProps> = ({ game, className = '' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <GameInfo game={game} className="mb-[1%] mx-auto text-gray-800" />

    <div className="flex items-center justify-between w-full px-[3%]">
      <TeamDisplay 
        team={game.localTeam} 
        alignment="left" 
        className="w-[38%]"
      />

      <GameScore
        localScore={game.localScore}
        visitorScore={game.visitorScore}
        className="px-[2%] py-[1.5%] bg-gray-100 rounded-lg w-[15%] mx-[2%] shadow-sm"
      />

      <TeamDisplay 
        team={game.visitorTeam} 
        alignment="right" 
        className="w-[38%]"
      />
    </div>
  </div>
);