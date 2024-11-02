import { useState, useEffect } from 'react';

const STORAGE_KEY = 'basketball-tools-shield-sizes';
const DEFAULT_SIZE = 75;
const MIN_SIZE = 30;
const MAX_SIZE = 100;

let listeners: (() => void)[] = [];

const state = {
  shieldSize: DEFAULT_SIZE
};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useShieldSize() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const updateShieldSize = (size: number) => {
    const clampedSize = Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
    state.shieldSize = clampedSize;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shieldSize));
    notifyListeners();
  };

  const resetSize = () => {
    state.shieldSize = DEFAULT_SIZE;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shieldSize));
    notifyListeners();
  };

  // Initialize state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.shieldSize = JSON.parse(stored);
        notifyListeners();
      }
    } catch (error) {
      console.error('Error loading shield size:', error);
    }
  }, []);

  return {
    shieldSize: state.shieldSize,
    updateShieldSize,
    resetSize,
    MIN_SIZE,
    MAX_SIZE
  };
}