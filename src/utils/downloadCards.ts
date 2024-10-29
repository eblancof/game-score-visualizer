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

    // Remove gradient backgrounds that might interfere
    const gradientElements = clonedCard.getElementsByClassName('from-red-500');
    Array.from(gradientElements).forEach((element: Element) => {
      (element as HTMLElement).style.background = 'transparent';
      element.classList.remove('from-red-500', 'to-white', 'bg-gradient-to-b');
    });

    // Add export-specific styles
    const exportStyles = document.createElement('style');
    exportStyles.textContent = `
      .game-card {
        width: 1080px !important;
        height: 1080px !important;
        background-color: white !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }
      .game-card > div {
        background-color: transparent !important;
      }
      .game-card .text-center {
        font-size: 18.14px !important;
      }
      .game-card .font-semibold {
        font-size: 20.41px !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      }
      .game-card .font-bold {
        font-size: 22.68px !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
        line-height: 1.2 !important;
      }
      .game-card .text-gray-500 {
        font-size: 13.65px !important;
      }
      .game-card img {
        width: auto !important;
        height: auto !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
      }
      .game-card img.rounded-full {
        width: 57px !important;
        height: 57px !important;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15)) !important;
        border: 1.5px solid rgba(255,255,255,0.8) !important;
        object-fit: cover !important;
      }
      .game-card .w-[15%] {
        width: 162px !important;
      }
      .game-card .w-[38%] {
        width: 410.4px !important;
      }
      .game-card .p-[3%] {
        padding: 32.4px !important;
      }
      .game-card .py-[2%] {
        padding-top: 21.6px !important;
        padding-bottom: 21.6px !important;
      }
      .game-card .py-[1.5%] {
        padding-top: 16.2px !important;
        padding-bottom: 16.2px !important;
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
      .game-card .text-gray-800 {
        text-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      }
      .game-card .text-red-800 {
        text-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      }
    `;
    
    clonedCard.appendChild(exportStyles);
    wrapper.appendChild(clonedCard);
    document.body.appendChild(wrapper);

    // Wait for all images to load
    const images = clonedCard.getElementsByTagName('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

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
      onclone: (document, element) => {
        const images = element.getElementsByTagName('img');
        Array.from(images).forEach(img => {
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
          img.style.objectFit = 'contain';
        });
      }
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