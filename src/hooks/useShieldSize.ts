import { useState, useEffect } from 'react';

export interface ShieldSizes {
  local: number;
  visitor: number;
}

const STORAGE_KEY = 'basketball-tools-shield-sizes';
const DEFAULT_SIZES: ShieldSizes = {
  local: 57,
  visitor: 57
};

const MIN_SIZE = 30;
const MAX_SIZE = 100;

let listeners: (() => void)[] = [];

const state = {
  shieldSizes: DEFAULT_SIZES
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

  const updateShieldSize = (team: keyof ShieldSizes, size: number) => {
    const clampedSize = Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
    state.shieldSizes = {
      ...state.shieldSizes,
      [team]: clampedSize
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shieldSizes));
    notifyListeners();
  };

  const resetSizes = () => {
    state.shieldSizes = DEFAULT_SIZES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shieldSizes));
    notifyListeners();
  };

  // Initialize state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.shieldSizes = JSON.parse(stored);
        notifyListeners();
      }
    } catch (error) {
      console.error('Error loading shield sizes:', error);
    }
  }, []);

  return {
    shieldSizes: state.shieldSizes,
    updateShieldSize,
    resetSizes,
    MIN_SIZE,
    MAX_SIZE
  };
}