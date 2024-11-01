import { useState, useEffect } from 'react';
import WebFont from 'webfontloader';

export interface FontData {
  family: string;
  variants: string[];
  category: string;
  version: string;
  lastModified: string;
  files: Record<string, string>;
  kind: string;
  menu: string;
}

const STORAGE_KEY = 'basketball-tools-fonts';
const SELECTED_FONTS_KEY = 'basketball-tools-selected-fonts';
const API_KEY = 'AIzaSyAOPS8nM6CSL5RKqvHQpuq5fHb_yWtRZEI';

const DEFAULT_FONTS = {
  competition: 'Inter',
  dateTime: 'Inter',
  teamName: 'Inter',
  score: 'Inter'
};

export function useGoogleFonts() {
  const [fonts, setFonts] = useState<FontData[]>([]);
  const [savedFonts, setSavedFonts] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['Inter'];
    } catch {
      return ['Inter'];
    }
  });
  const [selectedFonts, setSelectedFonts] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(SELECTED_FONTS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FONTS;
    } catch {
      return DEFAULT_FONTS;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all Google Fonts
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`
        );
        if (!response.ok) throw new Error('Failed to fetch fonts');
        const data = await response.json();
        setFonts(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load fonts');
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  // Load saved fonts
  useEffect(() => {
    if (savedFonts.length > 0) {
      WebFont.load({
        google: {
          families: savedFonts
        },
        active: () => {
          console.log('Fonts loaded successfully');
        },
        inactive: () => {
          console.error('Failed to load some fonts');
        }
      });
    }
  }, [savedFonts]);

  // Save fonts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFonts));
      localStorage.setItem(SELECTED_FONTS_KEY, JSON.stringify(selectedFonts));
    } catch (error) {
      console.error('Error saving fonts:', error);
    }
  }, [savedFonts, selectedFonts]);

  const addFont = (fontFamily: string) => {
    if (!savedFonts.includes(fontFamily)) {
      WebFont.load({
        google: {
          families: [fontFamily]
        },
        active: () => {
          setSavedFonts(prev => [...prev, fontFamily]);
        },
        inactive: () => {
          setError(`Failed to load font: ${fontFamily}`);
        }
      });
    }
  };

  const removeFont = (fontFamily: string) => {
    if (fontFamily === 'Inter') return; // Prevent removing default font
    setSavedFonts(prev => prev.filter(f => f !== fontFamily));
  };

  const updateFont = (element: string, fontFamily: string) => {
    setSelectedFonts(prev => ({
      ...prev,
      [element]: fontFamily
    }));
  };

  const resetFonts = () => {
    setSelectedFonts(DEFAULT_FONTS);
  };

  return {
    fonts,
    savedFonts,
    selectedFonts,
    loading,
    error,
    addFont,
    removeFont,
    updateFont,
    resetFonts
  };
}