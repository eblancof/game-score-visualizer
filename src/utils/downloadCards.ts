import html2canvas from 'html2canvas';
import { GameData } from '../types/gameData';

export const downloadCards = async (cards: GameData[][]) => {
  const cardElements = document.querySelectorAll('.game-card');
  
  for (let i = 0; i < cardElements.length; i++) {
    const cardElement = cardElements[i] as HTMLElement;
    if (cardElement) {
      try {
        // Clone the card element to modify it for download
        const clonedCard = cardElement.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedCard);
        
        // Set fixed dimensions for the download
        clonedCard.style.width = '2056px';
        clonedCard.style.height = '2056px';
        clonedCard.style.position = 'fixed';
        clonedCard.style.top = '-9999px';
        clonedCard.style.left = '-9999px';
        
        const canvas = await html2canvas(clonedCard, {
          width: 2056,
          height: 2056,
          scale: 1,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (document, element) => {
            // Adjust font sizes for the download version
            element.querySelectorAll('.text-sm, .text-base, .text-lg').forEach(el => {
              (el as HTMLElement).style.fontSize = '24px';
            });
            element.querySelectorAll('.text-xs').forEach(el => {
              (el as HTMLElement).style.fontSize = '20px';
            });
            // Adjust logo sizes for the download version
            element.querySelectorAll('[class*="w-24"], [class*="w-32"]').forEach(el => {
              (el as HTMLElement).style.width = '192px';
            });
            element.querySelectorAll('[class*="h-12"], [class*="h-16"]').forEach(el => {
              (el as HTMLElement).style.height = '96px';
            });
          }
        });

        // Remove the cloned element
        document.body.removeChild(clonedCard);

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