import { useState, useEffect } from 'react';

interface ResultsBackground {
  color: string;
  opacity: number;
}

const STORAGE_KEY = 'basketball-tools-results-bg';
const DEFAULT_BACKGROUND: ResultsBackground = {
  color: '#F3F4F6',
  opacity: 0.2
};

export function useResultsBackground() {
  const [background, setBackground] = useState<ResultsBackground>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_BACKGROUND;
    } catch {
      return DEFAULT_BACKGROUND;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(background));
    } catch (error) {
      console.error('Error saving results background:', error);
    }
  }, [background]);

  const updateBackground = (updates: Partial<ResultsBackground>) => {
    setBackground(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetBackground = () => {
    setBackground(DEFAULT_BACKGROUND);
  };

  return {
    background,
    updateBackground,
    resetBackground
  };
}