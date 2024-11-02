import { Team } from '../types/gameData';

export const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    // Only try to construct URL if it has a protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url);
      return true;
    }
    // Try with https:// prefix
    new URL(`https://${url}`);
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
  
  // Handle absolute URLs
  if (team.shieldUrl.startsWith('http://') || team.shieldUrl.startsWith('https://')) {
    return isValidUrl(team.shieldUrl) ? team.shieldUrl : fallbackUrl;
  }
  
  // Try to construct a valid URL with https://
  const urlWithProtocol = `https://${team.shieldUrl}`;
  return isValidUrl(urlWithProtocol) ? urlWithProtocol : fallbackUrl;
};