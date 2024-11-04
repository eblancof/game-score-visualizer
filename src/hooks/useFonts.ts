import { useState, useEffect } from 'react';
import WebFont from 'webfontloader';

export interface CustomFont {
  id: string;
  family: string;
  source: string;
  type: 'google' | 'custom';
  url?: string;
  weights?: number[];
}

const STORAGE_KEY = 'basketball-tools-custom-fonts';
const AVAILABLE_WEIGHTS = [400, 500, 600, 700];

const DEFAULT_GOOGLE_FONTS = [
  'Montserrat',
  'Roboto',
  'Oswald',
  'Bebas Neue',
  'Anton',
  'Teko',
  'Barlow Condensed',
  'Fjalla One',
  'Russo One',
  'Black Ops One'
];

export function useFonts() {
  const [fonts, setFonts] = useState<CustomFont[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const customFonts = stored ? JSON.parse(stored) : [];
      return [
        ...DEFAULT_GOOGLE_FONTS.map(font => ({
          id: font.toLowerCase().replace(/\s+/g, '-'),
          family: font,
          source: font,
          type: 'google' as const,
          weights: AVAILABLE_WEIGHTS
        })),
        ...customFonts
      ];
    } catch (error) {
      console.error('Error loading fonts:', error);
      return DEFAULT_GOOGLE_FONTS.map(font => ({
        id: font.toLowerCase().replace(/\s+/g, '-'),
        family: font,
        source: font,
        type: 'google' as const,
        weights: AVAILABLE_WEIGHTS
      }));
    }
  });

  useEffect(() => {
    const customFonts = fonts.filter(font => font.type === 'custom');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customFonts));
    } catch (error) {
      console.error('Error saving fonts:', error);
    }
  }, [fonts]);

  useEffect(() => {
    // Load Google Fonts with specific weights
    const googleFonts = fonts
      .filter(font => font.type === 'google')
      .map(font => `${font.family}:${AVAILABLE_WEIGHTS.join(',')}`);

    if (googleFonts.length > 0) {
      WebFont.load({
        google: {
          families: googleFonts
        },
        active: () => {
          console.log('Google Fonts loaded successfully');
        },
        inactive: () => {
          console.error('Failed to load some Google Fonts');
        }
      });
    }

    // Load custom fonts using @font-face for each weight
    const customFonts = fonts.filter(font => font.type === 'custom');
    if (customFonts.length > 0) {
      const style = document.createElement('style');
      style.textContent = customFonts
        .map(
          font => `
            @font-face {
              font-family: '${font.family}';
              src: url('${font.url}') format('${font.source.endsWith('.otf') ? 'opentype' : 'truetype'}');
              font-weight: 400;
            }
            @font-face {
              font-family: '${font.family}';
              src: url('${font.url}') format('${font.source.endsWith('.otf') ? 'opentype' : 'truetype'}');
              font-weight: 500;
            }
            @font-face {
              font-family: '${font.family}';
              src: url('${font.url}') format('${font.source.endsWith('.otf') ? 'opentype' : 'truetype'}');
              font-weight: 600;
            }
            @font-face {
              font-family: '${font.family}';
              src: url('${font.url}') format('${font.source.endsWith('.otf') ? 'opentype' : 'truetype'}');
              font-weight: 700;
            }
          `
        )
        .join('\n');
      document.head.appendChild(style);
    }
  }, [fonts]);

  const addFont = async (file: File) => {
    try {
      const reader = new FileReader();
      const fontUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Extract font family name from the file
      const fontFamily = file.name.replace(/\.(otf|ttf)$/, '');
      const fontId = `custom-${Date.now()}`;

      const newFont: CustomFont = {
        id: fontId,
        family: fontFamily,
        source: file.name,
        type: 'custom',
        url: fontUrl,
        weights: AVAILABLE_WEIGHTS
      };

      setFonts(prev => [...prev, newFont]);
      return fontId;
    } catch (error) {
      console.error('Error adding font:', error);
      throw error;
    }
  };

  const removeFont = (id: string) => {
    const font = fonts.find(f => f.id === id);
    if (font?.type === 'google') {
      console.warn('Cannot remove default Google fonts');
      return;
    }
    setFonts(prev => prev.filter(f => f.id !== id));
  };

  return {
    fonts,
    addFont,
    removeFont,
    availableWeights: AVAILABLE_WEIGHTS
  };
}