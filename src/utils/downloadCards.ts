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
    clonedCard.style.width = '100%';
    clonedCard.style.height = '100%';
    clonedCard.style.transform = 'none';
    clonedCard.style.margin = '0';
    clonedCard.style.padding = '0';
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

    // Capture the card at base resolution
    const canvas = await html2canvas(clonedCard, {
      scale: 1, // Capture at 1:1 scale
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