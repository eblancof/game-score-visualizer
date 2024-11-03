import html2canvas from 'html2canvas';

export const downloadCard = async (cardElement: HTMLElement, resolution: number, index?: number) => {
  if (!cardElement) return;

  try {
    // Create a wrapper with fixed dimensions
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '1080px';
    wrapper.style.height = '1080px';
    wrapper.style.zIndex = '-9999';
    wrapper.style.backgroundColor = '#ffffff';
    
    // Clone the card and prepare it for export
    const clonedCard = cardElement.cloneNode(true) as HTMLElement;
    
    // Reset transform and scale to ensure 1:1 pixel ratio
    const cardContent = clonedCard.querySelector('.absolute.inset-0.origin-top-left') as HTMLElement;
    if (cardContent) {
      cardContent.style.transform = 'none';
      cardContent.style.width = '1080px';
      cardContent.style.height = '1080px';
    }
    
    clonedCard.style.position = 'absolute';
    clonedCard.style.width = '1080px';
    clonedCard.style.height = '1080px';
    clonedCard.style.transform = 'none';
    clonedCard.style.margin = '0';
    clonedCard.style.padding = '0';

    // Handle background
    const backgroundDiv = clonedCard.querySelector('[style*="background-image"]') as HTMLElement;
    if (backgroundDiv) {
      const computedStyle = window.getComputedStyle(backgroundDiv);
      const newBackground = document.createElement('div');
      newBackground.style.position = 'absolute';
      newBackground.style.inset = '0';
      newBackground.style.backgroundImage = computedStyle.backgroundImage;
      newBackground.style.backgroundSize = 'cover';
      newBackground.style.backgroundPosition = 'center';
      newBackground.style.opacity = computedStyle.opacity;
      newBackground.style.zIndex = '0';
      clonedCard.insertBefore(newBackground, clonedCard.firstChild);
    }


    // Ensure content is properly layered
    const contentDiv = clonedCard.querySelector('.w-full.h-full.p-\\[3\\%\\]') as HTMLElement;
    if (contentDiv) {
      contentDiv.style.position = 'relative';
      contentDiv.style.zIndex = '1';
      contentDiv.style.backgroundColor = 'transparent';
    }

    wrapper.appendChild(clonedCard);
    document.body.appendChild(wrapper);

    // Wait for background image if it exists
    if (backgroundDiv) {
      const backgroundUrl = backgroundDiv.style.backgroundImage.match(/url\("(.+)"\)/)?.[1];
      if (backgroundUrl) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.src = backgroundUrl;
        });
      }
    }

    // Capture the card with html2canvas
    const canvas = await html2canvas(clonedCard, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1080,
      height: 1080,
      logging: false,
      imageTimeout: 0,
      
    });

    // Create the final canvas with the desired resolution
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = resolution;
    finalCanvas.height = resolution;
    const ctx = finalCanvas.getContext('2d', { alpha: false });
    
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, resolution, resolution);
      
      const size = Math.min(resolution, resolution);
      const x = (resolution - size) / 2;
      const y = (resolution - size) / 2;
      
      ctx.drawImage(canvas, x, y, size, size);
    }

    // Clean up
    document.body.removeChild(wrapper);

    // Download the image
    const link = document.createElement('a');
    const filename = index 
      ? `basketball-results-${index}-${resolution}x${resolution}.png`
      : `basketball-results-${resolution}x${resolution}.png`;
    
    const blob = await new Promise<Blob>(resolve => {
      finalCanvas.toBlob(
        blob => resolve(blob!),
        'image/png',
        1.0
      );
    });
    
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating card:', error);
    throw error;
  }
};