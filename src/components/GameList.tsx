import React from 'react';
import { GameData } from '../types/gameData';

interface GameListProps {
  cards: GameData[][];
}

const GameList: React.FC<GameListProps> = ({ cards }) => {
  const allGames = cards.flat();

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-4 px-4">
      {allGames.map((game) => (
        <div
          key={game.id}
          className="bg-card rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-border/50"
        >
          <div className="text-sm text-muted-foreground mb-2">
            {new Date(game.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}{' '}
            -{' '}
            {new Date(game.date).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          
          <div className="text-sm font-medium text-primary mb-4">
            {game.competition.name.toUpperCase()}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3 justify-between">
            <div className="flex items-center gap-3 w-full sm:w-[42%] justify-center sm:justify-start">
              <img
                src={game.localTeam.shieldUrl}
                alt={game.localTeam.club.name}
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-border/50 flex-shrink-0"
              />
              <span className="font-medium text-sm sm:text-base text-center sm:text-left text-foreground">
                {game.localTeam.club.name}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg w-full sm:w-auto justify-center flex-shrink-0 shadow-sm">
              <span className="font-bold text-lg text-foreground">
                {game.localScore ?? '-'}
              </span>
              <span className="font-bold text-lg text-muted-foreground">-</span>
              <span className="font-bold text-lg text-foreground">
                {game.visitorScore ?? '-'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-[42%] justify-center sm:justify-end">
              <span className="font-medium text-sm sm:text-base text-center sm:text-right text-foreground">
                {game.visitorTeam.club.name}
              </span>
              <img
                src={game.visitorTeam.shieldUrl}
                alt={game.visitorTeam.club.name}
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-border/50 flex-shrink-0"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;