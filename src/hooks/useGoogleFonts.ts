import { useState, useEffect } from 'react';

interface FontData {
  family: string;
  variants: string[];
  category: string;
}

const STORAGE_KEY = 'basketball-tools-fonts';

export function useGoogleFonts() {
  const [fonts, setFonts] = useState<FontData[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        competition: 'Inter',
        dateTime: 'Inter',
        teamName: 'Inter',
        score: 'Inter'
      };
    } catch {
      return {
        competition: 'Inter',
        dateTime: 'Inter',
        teamName: 'Inter',
        score: 'Inter'
      };
    }
  });

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAOPS8nM6CSL5RKqvHQpuq5fHb_yWtRZEI&sort=popularity'
        );
        const data = await response.json();
        setFonts(data.items.slice(0, 50)); // Load top 50 fonts
      } catch (error) {
        console.error('Error loading Google Fonts:', error);
      }
    };
    loadFonts();
  }, []);

  useEffect(() => {
    // Load selected fonts
    const loadSelectedFonts = async () => {
      const uniqueFonts = [...new Set(Object.values(selectedFonts))];
      const WebFont = (await import('webfontloader')).default;
      
      WebFont.load({
        google: {
          families: uniqueFonts
        }
      });
    };
    loadSelectedFonts();
  }, [selectedFonts]);

  const updateFont = (element: string, fontFamily: string) => {
    setSelectedFonts(prev => ({
      ...prev,
      [element]: fontFamily
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...selectedFonts,
      [element]: fontFamily
    }));
  };

  return {
    fonts,
    selectedFonts,
    updateFont
  };
}