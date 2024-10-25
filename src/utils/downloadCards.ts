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
      }
      .game-card > div {
        background-color: white !important;
      }
      .game-card .text-center {
        font-size: 17.28px !important;
      }
      .game-card .font-semibold {
        font-size: 19.44px !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      }
      .game-card .font-bold {
        font-size: 21.6px !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      }
      .game-card .text-gray-500 {
        font-size: 13px !important;
      }
      .game-card img.rounded-full {
        width: 54px !important;
        height: 54px !important;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15)) !important;
        border: 1.5px solid rgba(255,255,255,0.8) !important;
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
      .game-card .bg-gray-100 {
        box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
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

    const images = clonedCard.getElementsByTagName('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    const canvas = await html2canvas(clonedCard, {
      scale: 2,
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

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = resolution;
    finalCanvas.height = resolution;
    const ctx = finalCanvas.getContext('2d');
    
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

    document.body.removeChild(wrapper);

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