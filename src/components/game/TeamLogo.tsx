import React from 'react';
import { Team } from '../../types/gameData';
import { getValidImageUrl } from '../../utils/url';
import { useShieldSize } from '../../hooks/useShieldSize';
import { useTextColors } from '../../hooks/useTextColors';

interface TeamLogoProps {
  team: Team;
  className?: string;
  type?: 'local' | 'visitor';
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ team, className = '' }) => {
  const { shieldSize } = useShieldSize();
  const { shieldSettings } = useTextColors();

  return (
    <img
      src={getValidImageUrl(team)}
      alt={team.club.name}
      className={`rounded-full object-cover shadow-lg ring-2 ring-black/10 ${className}`}
      style={{ 
        width: `${shieldSize}px`,
        height: `${shieldSize}px`,
        filter: `drop-shadow(${shieldSettings.dropShadow})`
      }}
      loading="eager"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://placehold.co/57x57/png?text=Logo';
      }}
    />
  );
};