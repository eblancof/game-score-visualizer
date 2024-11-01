import React from 'react';
import { Team } from '../../types/gameData';
import { getValidImageUrl } from '../../utils/url';
import { useShieldSize } from '../../hooks/useShieldSize';

interface TeamLogoProps {
  team: Team;
  className?: string;
  type: 'local' | 'visitor';
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ team, className = '', type }) => {
  const { shieldSizes } = useShieldSize();
  const size = shieldSizes[type];

  return (
    <img
      src={getValidImageUrl(team)}
      alt={team.club.name}
      className={`rounded-full object-cover shadow-sm ring-1 ring-black/5 ${className}`}
      style={{ 
        width: `${size}px`,
        height: `${size}px`
      }}
      loading="eager"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://placehold.co/57x57/png?text=Logo';
      }}
    />
  );
};