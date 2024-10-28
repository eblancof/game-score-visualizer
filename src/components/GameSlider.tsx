import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from "./ui/button";
import { GameData } from '../types/gameData';
import { GameCard } from './GameCard';
import { downloadCard } from '../utils/downloadCards';
import { Logo } from '../hooks/useLogos';

interface GameSliderProps {
  cards: GameData[][];
  logos: Logo[];
}

const ExportOptions: React.FC = () => {
  const [resolution, setResolution] = useState<1080 | 2056>(1080);

  const handleExportCurrent = async () => {
    const cardElement = document.querySelector('.game-card');
    if (cardElement) {
      await downloadCard(cardElement as HTMLElement, resolution);
    }
  };

  const handleExportAll = async () => {
    const cards = document.querySelectorAll('.game-card');
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      await downloadCard(card as HTMLElement, resolution, i + 1);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <div className="flex gap-2 mr-4">
        <Button
          variant={resolution === 1080 ? "default" : "outline"}
          onClick={() => setResolution(1080)}
          className="whitespace-nowrap"
        >
          1080x1080
        </Button>
        <Button
          variant={resolution === 2056 ? "default" : "outline"}
          onClick={() => setResolution(2056)}
          className="whitespace-nowrap"
        >
          2056x2056
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleExportCurrent}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Download Current
        </Button>
        <Button
          variant="outline"
          onClick={handleExportAll}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Download All
        </Button>
      </div>
    </div>
  );
};

const GameSlider: React.FC<GameSliderProps> & { ExportOptions: typeof ExportOptions } = ({ cards, logos }) => {
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

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-[1080px] mx-auto">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="h-full flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              ref={currentCardRef}
            >
              {cards.map((cardGames, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <GameCard games={cardGames} logos={logos} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-[2%] top-1/2 transform -translate-y-1/2 w-[8%] aspect-square"
          onClick={goToPrevious}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-[50%] h-[50%]" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-[2%] top-1/2 transform -translate-y-1/2 w-[8%] aspect-square"
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
                index === currentIndex ? 'bg-primary' : 'bg-muted'
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

GameSlider.ExportOptions = ExportOptions;

export default GameSlider;