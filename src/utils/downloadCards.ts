import html2canvas from 'html2canvas';
import { GameData } from '../types/gameData';

export const downloadCards = async (cards: GameData[][]) => {
  const cardElements = document.querySelectorAll('.game-card');
  
  for (let i = 0; i < cardElements.length; i++) {
    const cardElement = cardElements[i] as HTMLElement;
    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement, {
          width: 2056,
          height: 2056,
          scale: 2,
          backgroundColor: null,
        });

        const link = document.createElement('a');
        link.download = `basketball-results-card-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error(`Error generating card ${i + 1}:`, error);
      }
    }
  }
};