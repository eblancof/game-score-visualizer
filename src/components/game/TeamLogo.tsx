import React from 'react';
import { Team } from '../../types/gameData';
import { getValidImageUrl } from '../../utils/url';

interface TeamLogoProps {
  team: Team;
  className?: string;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ team, className = '' }) => (
  <img
    src={getValidImageUrl(team)}
    alt={team.club.name}
    className={`rounded-full object-cover shadow-sm ring-1 ring-black/5 ${className}`}
    style={{ 
      width: '57px',
      height: '57px'
    }}
    loading="eager"
    onError={(e) => {
      (e.target as HTMLImageElement).src = 'https://placehold.co/57x57/png?text=Logo';
    }}
  />
);