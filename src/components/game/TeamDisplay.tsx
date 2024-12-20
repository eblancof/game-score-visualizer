import React from 'react';
import { Team } from '../../types/gameData';
import { TeamLogo } from './TeamLogo';
import { useTextColors } from '../../hooks/useTextColors';

interface TeamDisplayProps {
  team: Team;
  alignment?: 'left' | 'right';
  className?: string;
  type: 'local' | 'visitor';
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({ 
  team, 
  alignment = 'left',
  className = '',
  type
}) => {
  const { textColors, fonts } = useTextColors();
  const flexDirection = alignment === 'left' ? 'flex-row' : 'flex-row-reverse';
  
  return (
    <div className={`flex items-center gap-[32.4px] ${flexDirection} ${className}`}>
      <TeamLogo team={team} type={type} />
      <div 
        className="font-semibold text-center flex-1"
        style={{ 
          color: textColors?.teamName,
          fontFamily: fonts.teamName.family,
          fontSize: `${fonts.teamName.size}px`,
          fontWeight: fonts.teamName.weight,
          textShadow: fonts.teamName.textShadow
        }}
      >
        {team.club.name.toUpperCase()}
      </div>
    </div>
  );
};