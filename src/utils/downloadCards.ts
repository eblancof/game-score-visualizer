import html2canvas from 'html2canvas';

export const downloadCard = async (cardElement: HTMLElement, resolution: number, index?: number) => {
  if (!cardElement) return;

  try {
    // Create a wrapper div for better rendering
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = `${resolution}px`;
    wrapper.style.height = `${resolution}px`;
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
      scale: resolution / 1080, // Scale based on target resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: resolution,
      height: resolution,
      logging: false,
      onclone: (_, element) => {
        element.style.fontSmooth = 'always';
        element.style.webkitFontSmoothing = 'antialiased';
        element.style.textRendering = 'optimizeLegibility';
      }
    });

    // Clean up
    document.body.removeChild(wrapper);

    // Download the image
    const link = document.createElement('a');
    const filename = index 
      ? `basketball-results-${index}-${resolution}x${resolution}.png`
      : `basketball-results-${resolution}x${resolution}.png`;
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (error) {
    console.error('Error generating card:', error);
    throw error;
  }
};