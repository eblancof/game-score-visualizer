import { useState, useEffect, useCallback } from 'react';
import { useBackgrounds } from './useBackgrounds';
import { generateContrastingColors } from '../utils/colors';
import { useFonts } from './useFonts';

export interface TextColors {
  competition: string;
  dateTime: string;
  teamName: string;
  score: string;
}

export interface FontSettings {
  family: string;
  size: number;
  weight: number;
  textShadow: string;
}

export interface ScoreBackground {
  color: string;
  opacity: number;
}

export interface ShieldSettings {
  dropShadow: string;
}

const DEFAULT_COLORS: TextColors = {
  competition: '#991B1B',
  dateTime: '#1F2937',
  teamName: '#1F2937',
  score: '#1F2937',
};

const DEFAULT_FONTS: Record<keyof TextColors, FontSettings> = {
  competition: { family: 'Montserrat', size: 20, weight: 600, textShadow: '0px 0px 0px rgba(0, 0, 0, 0.2)' },
  dateTime: { family: 'Montserrat', size: 20, weight: 500, textShadow: '0px 0px 0px rgba(0, 0, 0, 0.2)' },
  teamName: { family: 'Montserrat', size: 24, weight: 600, textShadow: '0px 0px 0px rgba(0, 0, 0, 0.2)' },
  score: { family: 'Montserrat', size: 26, weight: 700, textShadow: '0px 0px 0px rgba(0, 0, 0, 0.2)' }
};

const DEFAULT_SCORE_BACKGROUND: ScoreBackground = {
  color: '#F3F4F6',
  opacity: 0.8
};

const DEFAULT_SHIELD_SETTINGS: ShieldSettings = {
  dropShadow: '0px 0px 0px rgba(0, 0, 0, 0.2)'
};

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 48;

const STORAGE_KEY = 'basketball-tools-text-colors';
const FONTS_STORAGE_KEY = 'basketball-tools-fonts';
const SCORE_BG_STORAGE_KEY = 'basketball-tools-score-background';
const SHIELD_SETTINGS_KEY = 'basketball-tools-shield-settings';

const AVAILABLE_WEIGHTS = [400, 500, 600, 700];

let listeners: (() => void)[] = [];

const state = {
  textColors: DEFAULT_COLORS,
  fonts: DEFAULT_FONTS,
  scoreBackground: DEFAULT_SCORE_BACKGROUND,
  shieldSettings: DEFAULT_SHIELD_SETTINGS
};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useTextColors() {
  const { getSelectedBackground } = useBackgrounds();
  const { fonts: availableFonts } = useFonts();
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

  const updateFontWeight = useCallback((key: keyof TextColors, weight: number) => {
    state.fonts = {
      ...state.fonts,
      [key]: { ...state.fonts[key], weight }
    };
    localStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(state.fonts));
    notifyListeners();
  }, []);

  const updateTextShadow = useCallback((key: keyof TextColors, shadowSize: number) => {
    const textShadow = `${shadowSize}px ${shadowSize}px ${shadowSize * 2}px rgba(0, 0, 0, 0.2)`;
    state.fonts = {
      ...state.fonts,
      [key]: { ...state.fonts[key], textShadow }
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

  const updateScoreBackground = useCallback((updates: Partial<ScoreBackground>) => {
    state.scoreBackground = {
      ...state.scoreBackground,
      ...updates
    };
    localStorage.setItem(SCORE_BG_STORAGE_KEY, JSON.stringify(state.scoreBackground));
    notifyListeners();
  }, []);

  const updateShieldSettings = useCallback((shadowSize: number) => {
    const dropShadow = `${shadowSize}px ${shadowSize}px ${shadowSize * 2}px rgba(0, 0, 0, 0.2)`;
    state.shieldSettings = {
      ...state.shieldSettings,
      dropShadow
    };
    localStorage.setItem(SHIELD_SETTINGS_KEY, JSON.stringify(state.shieldSettings));
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
    state.scoreBackground = DEFAULT_SCORE_BACKGROUND;
    state.shieldSettings = DEFAULT_SHIELD_SETTINGS;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.textColors));
    localStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(state.fonts));
    localStorage.setItem(SCORE_BG_STORAGE_KEY, JSON.stringify(state.scoreBackground));
    localStorage.setItem(SHIELD_SETTINGS_KEY, JSON.stringify(state.shieldSettings));
    notifyListeners();
  }, [getSelectedBackground]);

  useEffect(() => {
    try {
      const storedColors = localStorage.getItem(STORAGE_KEY);
      const storedFonts = localStorage.getItem(FONTS_STORAGE_KEY);
      const storedScoreBg = localStorage.getItem(SCORE_BG_STORAGE_KEY);
      const storedShieldSettings = localStorage.getItem(SHIELD_SETTINGS_KEY);
      
      if (storedColors) {
        state.textColors = JSON.parse(storedColors);
      }
      if (storedFonts) {
        state.fonts = JSON.parse(storedFonts);
      }
      if (storedScoreBg) {
        state.scoreBackground = JSON.parse(storedScoreBg);
      }
      if (storedShieldSettings) {
        state.shieldSettings = JSON.parse(storedShieldSettings);
      }
      notifyListeners();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  return {
    textColors: state.textColors,
    fonts: state.fonts,
    scoreBackground: state.scoreBackground,
    shieldSettings: state.shieldSettings,
    updateTextColor,
    updateFont,
    updateFontWeight,
    updateFontSize,
    updateTextShadow,
    updateScoreBackground,
    updateShieldSettings,
    resetColors,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE,
    availableFonts: availableFonts.map(font => font.family),
    availableWeights: AVAILABLE_WEIGHTS
  };
}