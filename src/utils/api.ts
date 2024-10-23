import { GameData } from '../types/gameData';

interface ApiResponse {
  games: GameData[];
  from: string;
  to: string;
}

export const fetchGameData = async (startDate: Date, endDate: Date): Promise<GameData[]> => {
  const baseUrl = 'https://api.clupik.com/games';
  const params = new URLSearchParams({
    clubId: '310',
    from: startDate.toISOString(),
    to: endDate.toISOString(),
    firstLoad: 'false',
    overrideClubId: '310',
    expand: 'localTeam,localTeam.club,visitorTeam,visitorTeam.club,organization,competition,group,stadium',
  });

  const response = await fetch(`${baseUrl}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game data');
  }

  const data: ApiResponse = await response.json();
  return data.games;
};