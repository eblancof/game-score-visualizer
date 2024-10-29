import ColorThief from 'colorthief';

export const generateContrastingColors = async (imageUrl: string): Promise<{
  competition: string;
  dateTime: string;
  teamName: string;
  score: string;
}> => {
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(img, 5);

    // Convert RGB to HSL and find the most suitable colors
    const colors = palette.map(rgb => rgbToHsl(rgb[0], rgb[1], rgb[2]));

    // Find a red/warm color for competition
    const competitionColor = colors.find(color => 
      (color.h >= 350 || color.h <= 10) && color.s >= 50
    ) || { h: 0, s: 75, l: 30 }; // Default red

    // Find dark colors for text
    const darkColors = colors.filter(color => color.l <= 30);
    
    return {
      competition: hslToHex(competitionColor.h, competitionColor.s, competitionColor.l),
      dateTime: hslToHex(0, 0, 20),
      teamName: hslToHex(0, 0, 20),
      score: hslToHex(0, 0, 20)
    };
  } catch (error) {
    console.error('Error generating colors:', error);
    return {
      competition: '#991B1B',
      dateTime: '#1F2937',
      teamName: '#1F2937',
      score: '#1F2937'
    };
  }
};

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}