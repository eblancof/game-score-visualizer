import { useState, useEffect } from 'react';
import { useBackgrounds } from './useBackgrounds';
import { generateContrastingColors } from '../utils/colors';

export interface TextColors {
  competition: string;
  dateTime: string;
  teamName: string;
  score: string;
}

const DEFAULT_COLORS: TextColors = {
  competition: '#991B1B', // red-800
  dateTime: '#1F2937', // gray-800
  teamName: '#1F2937', // gray-800
  score: '#1F2937', // gray-800
};

const STORAGE_KEY = 'basketball-tools-text-colors';

export function useTextColors() {
  const { getSelectedBackground } = useBackgrounds();
  const [textColors, setTextColors] = useState<TextColors>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      
      const background = getSelectedBackground();
      if (background) {
        return generateContrastingColors(background.url);
      }
      
      return DEFAULT_COLORS;
    } catch {
      return DEFAULT_COLORS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(textColors));
    } catch (error) {
      console.error('Error saving text colors:', error);
    }
  }, [textColors]);

  // Update colors when background changes
  useEffect(() => {
    const background = getSelectedBackground();
    if (background) {
      const newColors = generateContrastingColors(background.url);
      setTextColors(prev => ({
        ...prev,
        ...newColors
      }));
    }
  }, [getSelectedBackground]);

  const updateTextColor = (key: keyof TextColors, color: string) => {
    setTextColors(prev => ({
      ...prev,
      [key]: color
    }));
  };

  const resetColors = () => {
    const background = getSelectedBackground();
    if (background) {
      setTextColors(generateContrastingColors(background.url));
    } else {
      setTextColors(DEFAULT_COLORS);
    }
  };

  return {
    textColors,
    updateTextColor,
    resetColors
  };
}