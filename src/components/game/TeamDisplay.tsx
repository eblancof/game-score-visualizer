import React from 'react';
import { Team } from '../../types/gameData';
import { TeamLogo } from './TeamLogo';

interface TeamDisplayProps {
  team: Team;
  alignment?: 'left' | 'right';
  className?: string;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({ 
  team, 
  alignment = 'left',
  className = ''
}) => {
  const flexDirection = alignment === 'left' ? 'flex-row' : 'flex-row-reverse';
  
  return (
    <div className={`flex items-center gap-[3%] ${flexDirection} ${className}`}>
      <TeamLogo team={team} />
      <div className="font-semibold text-center flex-1 text-gray-800" style={{ fontSize: 'min(1.89vw, 20.41px)' }}>
        {team.club.name.toUpperCase()}
      </div>
    </div>
  );
};