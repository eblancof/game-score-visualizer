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

export function useShieldSize() {
  const [shieldSizes, setShieldSizes] = useState<ShieldSizes>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SIZES;
    } catch {
      return DEFAULT_SIZES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shieldSizes));
    } catch (error) {
      console.error('Error saving shield sizes:', error);
    }
  }, [shieldSizes]);

  const updateShieldSize = (team: keyof ShieldSizes, size: number) => {
    const clampedSize = Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
    setShieldSizes(prev => ({
      ...prev,
      [team]: clampedSize
    }));
  };

  const resetSizes = () => {
    setShieldSizes(DEFAULT_SIZES);
  };

  return {
    shieldSizes,
    updateShieldSize,
    resetSizes,
    MIN_SIZE,
    MAX_SIZE
  };
}