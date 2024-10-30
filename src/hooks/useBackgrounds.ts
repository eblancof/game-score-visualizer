import { useState, useEffect, useCallback } from 'react';

export interface Background {
  id: string;
  url: string;
  name: string;
  opacity: number;
}

const STORAGE_KEY = 'basketball-tools-backgrounds';
const SELECTED_KEY = 'selected-background';

export function useBackgrounds() {
  const [backgrounds, setBackgrounds] = useState<Background[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading backgrounds:', error);
      return [];
    }
  });

  const [selectedBackground, setSelectedBackground] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SELECTED_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backgrounds));
    } catch (error) {
      console.error('Error saving backgrounds:', error);
    }
  }, [backgrounds]);

  useEffect(() => {
    try {
      if (selectedBackground) {
        localStorage.setItem(SELECTED_KEY, selectedBackground);
      } else {
        localStorage.removeItem(SELECTED_KEY);
      }
    } catch (error) {
      console.error('Error saving selected background:', error);
    }
  }, [selectedBackground]);

  const addBackground = useCallback(async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newBackground: Background = {
          id: `background-${Date.now()}`,
          url: reader.result as string,
          name: file.name,
          opacity: 0.15
        };
        setBackgrounds(prev => [...prev, newBackground]);
        resolve(newBackground.id);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const removeBackground = useCallback((id: string) => {
    setBackgrounds(prev => prev.filter(bg => bg.id !== id));
    if (selectedBackground === id) {
      setSelectedBackground(null);
    }
  }, [selectedBackground]);

  const selectBackground = useCallback((id: string | null) => {
    setSelectedBackground(id);
  }, []);

  const getSelectedBackground = useCallback(() => {
    return backgrounds.find(bg => bg.id === selectedBackground);
  }, [backgrounds, selectedBackground]);

  const updateBackgroundOpacity = useCallback((id: string, opacity: number) => {
    setBackgrounds(prev => prev.map(bg => 
      bg.id === id ? { ...bg, opacity } : bg
    ));
  }, []);

  return {
    backgrounds,
    selectedBackground,
    addBackground,
    removeBackground,
    selectBackground,
    getSelectedBackground,
    updateBackgroundOpacity
  };
}