import html2canvas from 'html2canvas';
import { GameData } from '../types/gameData';

export const downloadCards = async (cards: GameData[][]) => {
  const cardElements = document.querySelectorAll('.game-card');
  
  for (let i = 0; i < cardElements.length; i++) {
    const cardElement = cardElements[i] as HTMLElement;
    if (cardElement) {
      try {
        // Create a wrapper div for better rendering
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.width = '1080px';
        wrapper.style.height = '1080px';
        wrapper.style.zIndex = '-9999';
        wrapper.style.backgroundColor = '#ffffff';
        
        // Clone the card and prepare it for capture
        const clonedCard = cardElement.cloneNode(true) as HTMLElement;
        clonedCard.style.position = 'relative';
        clonedCard.style.width = '100%';
        clonedCard.style.height = '100%';
        clonedCard.style.transform = 'none';
        wrapper.appendChild(clonedCard);
        document.body.appendChild(wrapper);

        // Wait for images to load
        const images = clonedCard.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        // Capture the card
        const canvas = await html2canvas(clonedCard, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 1080,
          height: 1080,
          logging: false,
          onclone: (_, element) => {
            // Ensure text is crisp
            element.style.fontSmooth = 'always';
            element.style.webkitFontSmoothing = 'antialiased';
            element.style.textRendering = 'optimizeLegibility';
          }
        });

        // Clean up
        document.body.removeChild(wrapper);

        // Download the image
        const link = document.createElement('a');
        link.download = `basketball-results-card-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error(`Error generating card ${i + 1}:`, error);
      }
    }
  }
};