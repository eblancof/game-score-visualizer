import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "./ui/button"
import { GameData } from '../types/gameData'
import CornerLogos from './CornerLogos'

interface GameCardProps {
  games: GameData[];
}

const GameCard: React.FC<GameCardProps> = ({ games }) => {
  const maxGames = Math.min(games.length, 6);
  const gamesList = games.slice(0, maxGames);

  return (
    <div className="game-card bg-white rounded-lg shadow-lg aspect-square w-full max-w-[1080px] max-h-[1080px] overflow-hidden relative">
      <div className="w-full h-full p-[5%] flex flex-col justify-between">
        <CornerLogos/>
        {gamesList.map((game) => (
          <div key={game.id} className="flex flex-col items-center justify-between text-sm sm:text-base lg:text-lg mb-2 sm:mb-4">
            <div className="text-center mb-2 sm:mb-3">
              <div className="text-xs sm:text-sm lg:text-base font-medium text-gray-700">
                {new Date(game.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(game.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}: <span className="text-red-900">{game.competition.name.toUpperCase()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center w-[40%] overflow-hidden justify-between">
                <img
                  src={game.localTeam.shieldUrl}
                  alt={game.localTeam.club.name}
                  className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="font-semibold text-center mx-1 sm:mx-3 flex-grow text-xs sm:text-sm lg:text-base min-h-[2.5em] flex items-center justify-center">
                  <span className="leading-tight">
                    {game.localTeam.club.name.split(' ').map((word, index) => (
                      <React.Fragment key={index}>
                        {word.toUpperCase()}
                        {index < game.localTeam.club.name.split(' ').length - 1 && ' '}
                        {index === Math.floor(game.localTeam.club.name.split(' ').length / 2) && <br />}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              </div>
              <div className="text-base sm:text-xl lg:text-2xl font-bold w-[20%] text-center flex-shrink-0">
                {game.localScore ?? '-'} - {game.visitorScore ?? '-'}
              </div>
              <div className="flex items-center justify-between w-[40%] overflow-hidden">
                <div className="font-semibold text-center mr-1 sm:mr-3 flex-grow text-xs sm:text-sm lg:text-base min-h-[2.5em] flex items-center justify-center">
                  <span className="leading-tight">
                    {game.visitorTeam.club.name.split(' ').map((word, index) => (
                      <React.Fragment key={index}>
                        {word.toUpperCase()}
                        {index < game.visitorTeam.club.name.split(' ').length - 1 && ' '}
                        {index === Math.floor(game.visitorTeam.club.name.split(' ').length / 2) && <br />}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
                <img
                  src={game.visitorTeam.shieldUrl}
                  alt={game.visitorTeam.club.name}
                  className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full object-cover ml-[3%] flex-shrink-0"
                />
              </div>
            </div>
          </div>
        ))}
        <CornerLogos/>
      </div>
    </div>
  );
};

interface GameSliderProps {
  cards: GameData[][];
}

const GameSlider: React.FC<GameSliderProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-[1080px] mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cards.map((cardGames, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <GameCard games={cardGames} />
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={goToPrevious}
        aria-label="Previous card"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={goToNext}
        aria-label="Next card"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {cards.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GameSlider;