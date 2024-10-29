import { Team } from '../types/gameData';

export const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    // Add protocol if missing
    const urlToTest = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
};

export const getValidImageUrl = (team: Team): string => {
  const fallbackUrl = 'https://placehold.co/57x57/png?text=Logo';
  
  if (!team?.shieldUrl) return fallbackUrl;
  
  // Handle relative URLs
  if (team.shieldUrl.startsWith('/')) {
    return `https://api.clupik.com${team.shieldUrl}`;
  }
  
  return isValidUrl(team.shieldUrl) ? team.shieldUrl : fallbackUrl;
};