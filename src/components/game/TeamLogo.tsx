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
      className={`rounded-full object-cover shadow-lg ring-2 ring-black/10 ${className}`}
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))'
      }}
      loading="eager"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://placehold.co/57x57/png?text=Logo';
      }}
    />
  );
};