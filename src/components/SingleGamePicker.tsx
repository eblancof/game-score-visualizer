import React from 'react';
import { GameData } from '../types/gameData';

interface SingleGamePickerProps {
  onDateSelect: (date: Date) => void;
  games: GameData[];
  selectedGame: GameData | null;
  onGameSelect: (game: GameData) => void;
  loading: boolean;
  error: string | null;
}

const SingleGamePicker: React.FC<SingleGamePickerProps> = ({
  onDateSelect,
  games,
  selectedGame,
  onGameSelect,
  loading,
  error
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-xl shadow-md p-6 border border-border/50">
        <div className="mb-6">
          <label className="block text-foreground mb-2 font-medium">Select Date</label>
          <input
            type="date"
            onChange={(e) => onDateSelect(new Date(e.target.value))}
            className="w-full border border-border rounded-xl px-4 py-2 bg-muted text-foreground shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 [color-scheme:dark]"
          />
        </div>

        {error && (
          <p className="text-destructive mb-4">{error}</p>
        )}

        {loading ? (
          <p className="text-muted-foreground">Loading games...</p>
        ) : games.length > 0 ? (
          <div className="space-y-3">
            <label className="block text-foreground mb-2 font-medium">Select Game</label>
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => onGameSelect(game)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border border-border/50 ${
                  selectedGame?.id === game.id
                    ? 'bg-accent shadow-md'
                    : 'bg-card hover:bg-accent/50'
                } shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{game.localTeam.club.name}</p>
                    <p className="text-sm text-muted-foreground">vs</p>
                    <p className="font-medium text-foreground">{game.visitorTeam.club.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(game.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {game.competition.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : games.length === 0 && !loading ? (
          <p className="text-muted-foreground">No games found for this date</p>
        ) : null}
      </div>
    </div>
  );
};

export default SingleGamePicker;