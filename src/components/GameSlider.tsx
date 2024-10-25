import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "./ui/button";
import { GameData } from '../types/gameData';
import { GameCard } from './GameCard';
import ExportOptions from './ExportOptions';
import { downloadCard } from '../utils/downloadCards';

interface GameSliderProps {
  cards: GameData[][];
}

const GameSlider: React.FC<GameSliderProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCardRef = useRef<HTMLDivElement>(null);

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

  const handleExport = async (resolution: number) => {
    try {
      const cardElement = currentCardRef.current?.querySelector('.game-card');
      if (cardElement) {
        await downloadCard(cardElement as HTMLElement, resolution);
      }
    } catch (error) {
      console.error('Error exporting card:', error);
    }
  };

  return (
    <div className="space-y-4">
      <ExportOptions onExport={handleExport} />
      
      <div className="relative w-full max-w-[1200px] mx-auto">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="h-full flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              ref={currentCardRef}
            >
              {cards.map((cardGames, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <GameCard games={cardGames} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute left-[2%] top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-[8%] aspect-square"
          onClick={goToPrevious}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-[50%] h-[50%]" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-[2%] top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-[8%] aspect-square"
          onClick={goToNext}
          aria-label="Next card"
        >
          <ChevronRight className="w-[50%] h-[50%]" />
        </Button>
        
        <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 flex gap-[1%]">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`w-[1vw] aspect-square rounded-full ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSlider;