import { useState, useEffect } from 'react';

export interface Logo {
  id: string;
  url: string;
  position: { x: number; y: number };
  section: 'top' | 'bottom';
  size: number;
}

const STORAGE_KEY = 'basketball-tools-logos';

const DEFAULT_POSITIONS = {
  top: { x: 0, y: 0 },
  bottom: { x: 0, y: 0 }
};

const MIN_SIZE = 50;
const MAX_SIZE = 200;
const DEFAULT_SIZE = 100;

export function useLogos() {
  const [logos, setLogos] = useState<Logo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading logos:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
    } catch (error) {
      console.error('Error saving logos:', error);
    }
  }, [logos]);

  const addLogo = (section: 'top' | 'bottom') => {
    const newLogo: Logo = {
      id: `logo-${Date.now()}`,
      url: '',
      position: DEFAULT_POSITIONS[section],
      section,
      size: DEFAULT_SIZE
    };
    setLogos(current => [...current, newLogo]);
    return newLogo.id;
  };

  const updateLogo = (id: string, updates: Partial<Logo>) => {
    setLogos(current =>
      current.map(logo =>
        logo.id === id ? { ...logo, ...updates } : logo
      )
    );
  };

  const removeLogo = (id: string) => {
    setLogos(current => current.filter(logo => logo.id !== id));
  };

  const updateLogoPosition = (id: string, x: number, y: number) => {
    setLogos(current =>
      current.map(logo =>
        logo.id === id ? { ...logo, position: { x, y } } : logo
      )
    );
  };

  const updateLogoSize = (id: string, size: number) => {
    const clampedSize = Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
    setLogos(current =>
      current.map(logo =>
        logo.id === id ? { ...logo, size: clampedSize } : logo
      )
    );
  };

  return {
    logos,
    addLogo,
    updateLogo,
    removeLogo,
    updateLogoPosition,
    updateLogoSize,
    MIN_SIZE,
    MAX_SIZE,
    DEFAULT_SIZE
  };
}