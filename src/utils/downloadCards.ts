import html2canvas from 'html2canvas';

export const downloadCard = async (cardElement: HTMLElement, resolution: number, index?: number) => {
  if (!cardElement) return;

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
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    
    // Clone the card and prepare it for capture
    const clonedCard = cardElement.cloneNode(true) as HTMLElement;
    clonedCard.style.position = 'absolute';
    clonedCard.style.width = '1080px';
    clonedCard.style.height = '1080px';
    clonedCard.style.transform = 'none';
    clonedCard.style.margin = '0';
    clonedCard.style.padding = '0';

    // Force all elements to render at 1080px width
    const exportStyles = document.createElement('style');
    exportStyles.textContent = `
      .game-card {
        width: 1080px !important;
        height: 1080px !important;
      }
      .game-card .text-center {
        font-size: 17.28px !important;
      }
      .game-card .font-semibold {
        font-size: 19.44px !important;
      }
      .game-card .font-bold {
        font-size: 21.6px !important;
      }
      .game-card .text-gray-500 {
        font-size: 13px !important;
      }
      .game-card img.rounded-full {
        width: 54px !important;
        height: 54px !important;
      }
      .game-card .w-[15%] {
        width: 162px !important;
      }
      .game-card .w-[38%] {
        width: 410.4px !important;
      }
      .game-card .w-[20%] {
        width: 216px !important;
      }
      .game-card .p-[3%] {
        padding: 32.4px !important;
      }
      .game-card .py-[2%] {
        padding-top: 21.6px !important;
        padding-bottom: 21.6px !important;
      }
      .game-card .px-[2%] {
        padding-left: 21.6px !important;
        padding-right: 21.6px !important;
      }
      .game-card .px-[3%] {
        padding-left: 32.4px !important;
        padding-right: 32.4px !important;
      }
      .game-card .gap-[3%] {
        gap: 32.4px !important;
      }
      .game-card .mb-[1%] {
        margin-bottom: 10.8px !important;
      }
      .game-card .mx-[2%] {
        margin-left: 21.6px !important;
        margin-right: 21.6px !important;
      }
      .game-card .aspect-[2/1] {
        aspect-ratio: 2/1 !important;
      }
    `;
    
    clonedCard.appendChild(exportStyles);
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
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1080,
      height: 1080,
      logging: false,
      onclone: (_, element) => {
        element.style.fontSmooth = 'always';
        element.style.webkitFontSmoothing = 'antialiased';
        element.style.textRendering = 'optimizeLegibility';
      }
    });

    // Create a new canvas for the final scaled image
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = resolution;
    finalCanvas.height = resolution;
    const ctx = finalCanvas.getContext('2d');
    
    if (ctx) {
      // Use high-quality image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Clear the canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, resolution, resolution);
      
      // Calculate dimensions to maintain aspect ratio
      const size = Math.min(resolution, resolution);
      const x = (resolution - size) / 2;
      const y = (resolution - size) / 2;
      
      // Draw the image centered and scaled
      ctx.drawImage(canvas, x, y, size, size);
    }

    // Clean up
    document.body.removeChild(wrapper);

    // Download the image
    const link = document.createElement('a');
    const filename = index 
      ? `basketball-results-${index}-${resolution}x${resolution}.png`
      : `basketball-results-${resolution}x${resolution}.png`;
    link.download = filename;
    link.href = finalCanvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (error) {
    console.error('Error generating card:', error);
    throw error;
  }
};