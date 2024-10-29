import React from 'react';
import { Team } from '../../types/gameData';
import { TeamLogo } from './TeamLogo';
import { TextColors } from '../../hooks/useTextColors';

interface TeamDisplayProps {
  team: Team;
  alignment?: 'left' | 'right';
  className?: string;
  textColors?: TextColors;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({ 
  team, 
  alignment = 'left',
  className = '',
  textColors
}) => {
  const flexDirection = alignment === 'left' ? 'flex-row' : 'flex-row-reverse';
  
  return (
    <div className={`flex items-center gap-[3%] ${flexDirection} ${className}`}>
      <TeamLogo team={team} />
      <div 
        className="font-semibold text-center flex-1" 
        style={{ 
          fontSize: 'min(1.89vw, 20.41px)',
          color: textColors?.teamName
        }}
      >
        {team.club.name.toUpperCase()}
      </div>
    </div>
  );
};