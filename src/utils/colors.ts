import ColorThief from 'colorthief';
import { TextColors } from '../hooks/useTextColors';

const colorCache = new Map<string, TextColors>();

// Calculate relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Adjust color until it meets contrast requirements
function adjustColorForContrast(
  color: { h: number; s: number; l: number },
  bgLuminance: number,
  targetContrast: number = 4.5
): { h: number; s: number; l: number } {
  let adjustedColor = { ...color };
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    const hex = hslToHex(adjustedColor.h, adjustedColor.s, adjustedColor.l);
    const rgb = hexToRgb(hex);
    if (!rgb) break;

    const colorLuminance = getLuminance(rgb.r, rgb.g, rgb.b);
    const contrast = getContrastRatio(colorLuminance, bgLuminance);

    if (contrast >= targetContrast) break;

    // Adjust lightness to increase contrast
    if (bgLuminance > 0.5) {
      adjustedColor.l = Math.max(0, adjustedColor.l - 5);
    } else {
      adjustedColor.l = Math.min(100, adjustedColor.l + 5);
    }

    attempts++;
  }

  return adjustedColor;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const generateContrastingColors = async (imageUrl: string): Promise<TextColors> => {
  // Check cache first
  if (colorCache.has(imageUrl)) {
    return colorCache.get(imageUrl)!;
  }

  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(img, 8);
    const dominantColor = colorThief.getColor(img);

    // Calculate background luminance
    const bgLuminance = getLuminance(...dominantColor);

    // Convert RGB to HSL and find the most suitable colors
    const colors = palette.map(rgb => rgbToHsl(rgb[0], rgb[1], rgb[2]));

    // Find a red/warm color for competition
    let competitionColor = colors.find(color => 
      (color.h >= 350 || color.h <= 10) && color.s >= 50
    ) || { h: 0, s: 75, l: 30 };

    // Adjust colors for contrast
    competitionColor = adjustColorForContrast(competitionColor, bgLuminance, 4.5);
    
    // Create base dark color for text
    const baseTextColor = bgLuminance > 0.5 
      ? { h: 0, s: 0, l: 20 }
      : { h: 0, s: 0, l: 95 };

    // Adjust text colors for contrast
    const dateTimeColor = adjustColorForContrast({ ...baseTextColor }, bgLuminance, 4.5);
    const teamNameColor = adjustColorForContrast({ ...baseTextColor, l: baseTextColor.l - 10 }, bgLuminance, 7);
    const scoreColor = adjustColorForContrast({ ...baseTextColor, l: baseTextColor.l - 15 }, bgLuminance, 7);

    const result = {
      competition: hslToHex(competitionColor.h, competitionColor.s, competitionColor.l),
      dateTime: hslToHex(dateTimeColor.h, dateTimeColor.s, dateTimeColor.l),
      teamName: hslToHex(teamNameColor.h, teamNameColor.s, teamNameColor.l),
      score: hslToHex(scoreColor.h, scoreColor.s, scoreColor.l)
    };

    // Cache the result
    colorCache.set(imageUrl, result);
    
    return result;
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