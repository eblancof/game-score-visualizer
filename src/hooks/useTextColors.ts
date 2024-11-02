import { useState, useEffect, useCallback } from 'react';
import { useBackgrounds } from './useBackgrounds';
import { generateContrastingColors } from '../utils/colors';
import WebFont from 'webfontloader';

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
  competition: { family: 'Helvetica', size: 32.4 },
  dateTime: { family: 'Helvetica', size: 18.14 },
  teamName: { family: 'Helvetica', size: 20.41 },
  score: { family: 'Helvetica', size: 25.92 }
};

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 48;

const STORAGE_KEY = 'basketball-tools-text-colors';
const FONTS_STORAGE_KEY = 'basketball-tools-fonts';

const AVAILABLE_FONTS = [
  'Helvetica',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact'
];

// Load all fonts at startup
WebFont.load({
  custom: {
    families: AVAILABLE_FONTS,
    urls: [
      'https://fonts.googleapis.com/css2?family=Arial&family=Georgia&family=Helvetica&family=Impact&family=Tahoma&family=Times+New+Roman&family=Trebuchet+MS&family=Verdana&display=swap'
    ]
  }
});

let listeners: (() => void)[] = [];

const state = {
  textColors: DEFAULT_COLORS,
  fonts: DEFAULT_FONTS
};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useTextColors() {
  const { getSelectedBackground } = useBackgrounds();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const updateTextColor = useCallback((key: keyof TextColors, color: string) => {
    state.textColors = {
      ...state.textColors,
      [key]: color
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.textColors));
    notifyListeners();
  }, []);

  const updateFont = useCallback((key: keyof TextColors, family: string) => {
    state.fonts = {
      ...state.fonts,
      [key]: { ...state.fonts[key], family }
    };
    localStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(state.fonts));
    notifyListeners();
  }, []);

  const updateFontSize = useCallback((key: keyof TextColors, change: number) => {
    const currentSize = state.fonts[key].size;
    const newSize = Math.min(Math.max(currentSize + change, MIN_FONT_SIZE), MAX_FONT_SIZE);
    
    state.fonts = {
      ...state.fonts,
      [key]: { ...state.fonts[key], size: newSize }
    };
    localStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(state.fonts));
    notifyListeners();
  }, []);

  const resetColors = useCallback(async () => {
    const background = getSelectedBackground();
    if (background) {
      try {
        const colors = await generateContrastingColors(background.url);
        state.textColors = colors;
      } catch (error) {
        console.error('Error generating colors:', error);
        state.textColors = DEFAULT_COLORS;
      }
    } else {
      state.textColors = DEFAULT_COLORS;
    }
    state.fonts = DEFAULT_FONTS;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.textColors));
    localStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(state.fonts));
    notifyListeners();
  }, [getSelectedBackground]);

  useEffect(() => {
    try {
      const storedColors = localStorage.getItem(STORAGE_KEY);
      const storedFonts = localStorage.getItem(FONTS_STORAGE_KEY);
      
      if (storedColors) {
        state.textColors = JSON.parse(storedColors);
      }
      if (storedFonts) {
        state.fonts = JSON.parse(storedFonts);
      }
      notifyListeners();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  return {
    textColors: state.textColors,
    fonts: state.fonts,
    updateTextColor,
    updateFont,
    updateFontSize,
    resetColors,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE,
    availableFonts: AVAILABLE_FONTS
  };
}