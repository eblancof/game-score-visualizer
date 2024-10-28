import React from 'react';
import { Team } from '../../types/gameData';

interface TeamLogoProps {
  team: Team;
  className?: string;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getValidImageUrl = (url: string | undefined): string => {
  if (!url || !isValidUrl(url)) {
    return 'https://placehold.co/57x57/png?text=Club';
  }
  return url;
};

export const TeamLogo: React.FC<TeamLogoProps> = ({ team, className = '' }) => (
  <img
    src={getValidImageUrl(team.shieldUrl)}
    alt={team.club.name}
    className={`rounded-full object-cover shadow-sm ring-1 ring-black/5 ${className}`}
    style={{ width: 'min(15.75%, 57px)', aspectRatio: '1/1' }}
    loading="eager"
    onError={(e) => {
      (e.target as HTMLImageElement).src = 'https://placehold.co/57x57/png?text=Logo';
    }}
  />
);