import html2canvas from 'html2canvas';

export const downloadCard = async (cardElement: HTMLElement, resolution: number, index?: number) => {
  if (!cardElement) return;

  try {
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
    
    const clonedCard = cardElement.cloneNode(true) as HTMLElement;
    clonedCard.style.position = 'absolute';
    clonedCard.style.width = '1080px';
    clonedCard.style.height = '1080px';
    clonedCard.style.transform = 'none';
    clonedCard.style.margin = '0';
    clonedCard.style.padding = '0';
    clonedCard.style.backgroundColor = '#ffffff';

    const allElements = clonedCard.getElementsByClassName('from-red-500');
    Array.from(allElements).forEach((element: Element) => {
      (element as HTMLElement).style.background = 'white';
      element.classList.remove('from-red-500', 'to-white', 'bg-gradient-to-b');
    });

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
        background-color: white !important;
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
      .game-card img.rounded-full {
        width: 57px !important;
        height: 57px !important;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15)) !important;
        border: 1.5px solid rgba(255,255,255,0.8) !important;
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
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

    // Wait for all images to load with high quality
    const images = clonedCard.getElementsByTagName('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      // Force image reload with cache disabled for better quality
      img.src = img.src + '?quality=100';
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Create initial canvas with higher scale
    const canvas = await html2canvas(clonedCard, {
      scale: 4, // Increased scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1080,
      height: 1080,
      logging: false,
      imageTimeout: 0, // No timeout for image loading
    });

    // Create final canvas with desired resolution
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = resolution;
    finalCanvas.height = resolution;
    const ctx = finalCanvas.getContext('2d', { alpha: false });
    
    if (ctx) {
      // Enable high-quality image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, resolution, resolution);
      
      const size = Math.min(resolution, resolution);
      const x = (resolution - size) / 2;
      const y = (resolution - size) / 2;
      
      ctx.drawImage(canvas, x, y, size, size);
    }

    document.body.removeChild(wrapper);

    // Create download link with higher quality PNG
    const link = document.createElement('a');
    const filename = index 
      ? `basketball-results-${index}-${resolution}x${resolution}.png`
      : `basketball-results-${resolution}x${resolution}.png`;
    
    // Use higher quality PNG encoding
    const blob = await new Promise<Blob>(resolve => {
      finalCanvas.toBlob(
        blob => resolve(blob!),
        'image/png',
        1.0 // Maximum quality
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