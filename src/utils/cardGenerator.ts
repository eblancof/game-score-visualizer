import { GameData } from '../types/gameData';

export const generateCards = (games: GameData[]): GameData[][] => {
  const cards: GameData[][] = [];
  const gamesPerCard = 6;

  for (let i = 0; i < games.length; i += gamesPerCard) {
    cards.push(games.slice(i, i + gamesPerCard));
  }

  return cards;
};