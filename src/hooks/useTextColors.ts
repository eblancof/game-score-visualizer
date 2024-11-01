import { useState, useEffect, useCallback } from 'react';
import { useBackgrounds } from './useBackgrounds';
import { generateContrastingColors } from '../utils/colors';

export interface TextColors {
  competition: string;
  dateTime: string;
  teamName: string;
  score: string;
}

export interface FontSettings {
  family: string;
  size: number;
}

const DEFAULT_COLORS: TextColors = {
  competition: '#991B1B',
  dateTime: '#1F2937',
  teamName: '#1F2937',
  score: '#1F2937',
};

const DEFAULT_FONTS: Record<keyof TextColors, FontSettings> = {
  competition: { family: 'Arial', size: 32.4 },
  dateTime: { family: 'Arial', size: 18.14 },
  teamName: { family: 'Arial', size: 20.41 },
  score: { family: 'Arial', size: 25.92 }
};

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 48;

const STORAGE_KEY = 'basketball-tools-text-colors';
const FONTS_STORAGE_KEY = 'basketball-tools-fonts';

export function useTextColors() {
  const { getSelectedBackground } = useBackgrounds();
  const [textColors, setTextColors] = useState<TextColors>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_COLORS;
    } catch {
      return DEFAULT_COLORS;
    }
  });

  const [fonts, setFonts] = useState<Record<keyof TextColors, FontSettings>>(() => {
    try {
      const stored = localStorage.getItem(FONTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FONTS;
    } catch {
      return DEFAULT_FONTS;
    }
  });

  const updateTextColor = useCallback((key: keyof TextColors, color: string) => {
    setTextColors(prev => ({
      ...prev,
      [key]: color
    }));
  }, []);

  const updateFont = useCallback((key: keyof TextColors, family: string) => {
    setFonts(prev => ({
      ...prev,
      [key]: { ...prev[key], family }
    }));
  }, []);

  const updateFontSize = useCallback((key: keyof TextColors, change: number) => {
    setFonts(prev => {
      const currentSize = prev[key].size;
      const newSize = Math.min(Math.max(currentSize + change, MIN_FONT_SIZE), MAX_FONT_SIZE);
      return {
        ...prev,
        [key]: { ...prev[key], size: newSize }
      };
    });
  }, []);

  const resetColors = useCallback(async () => {
    const background = getSelectedBackground();
    if (background) {
      try {
        const colors = await generateContrastingColors(background.url);
        setTextColors(colors);
      } catch (error) {
        console.error('Error generating colors:', error);
        setTextColors(DEFAULT_COLORS);
      }
    } else {
      setTextColors(DEFAULT_COLORS);
    }
    setFonts(DEFAULT_FONTS);
  }, [getSelectedBackground]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(textColors));
      localStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(fonts));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [textColors, fonts]);

  useEffect(() => {
    const background = getSelectedBackground();
    if (background) {
      generateContrastingColors(background.url)
        .then(colors => {
          setTextColors(prev => ({
            ...prev,
            ...colors
          }));
        })
        .catch(error => {
          console.error('Error generating colors:', error);
        });
    }
  }, [getSelectedBackground]);

  return {
    textColors,
    updateTextColor,
    resetColors,
    fonts,
    updateFont,
    updateFontSize,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE,
    availableFonts: [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Georgia',
      'Verdana',
      'Tahoma',
      'Trebuchet MS',
      'Impact'
    ]
  };
}