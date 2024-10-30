import { useState, useEffect, useCallback } from 'react';
import { useBackgrounds } from './useBackgrounds';
import { generateContrastingColors } from '../utils/colors';

export interface TextColors {
  competition: string;
  dateTime: string;
  teamName: string;
  score: string;
}

const DEFAULT_COLORS: TextColors = {
  competition: '#991B1B',
  dateTime: '#1F2937',
  teamName: '#1F2937',
  score: '#1F2937',
};

const STORAGE_KEY = 'basketball-tools-text-colors';

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

  const updateTextColor = useCallback((key: keyof TextColors, color: string) => {
    setTextColors(prev => ({
      ...prev,
      [key]: color
    }));
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
  }, [getSelectedBackground]);

  // Save colors to localStorage when they change
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
    resetColors
  };
}