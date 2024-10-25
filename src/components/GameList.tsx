import React from 'react';
import { GameData } from '../types/gameData';
import { GameCard } from './GameCard';

interface GameListProps {
  cards: GameData[][];
}

const GameList: React.FC<GameListProps> = ({ cards }) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto grid gap-8">
      {cards.map((cardGames, index) => (
        <div key={index} className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0">
            <GameCard games={cardGames} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;