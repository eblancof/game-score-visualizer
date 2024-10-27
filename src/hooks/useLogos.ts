import { useState, useEffect } from 'react';

export interface Logo {
  id: string;
  url: string;
  name: string;
}

const STORAGE_KEY = 'basketball-tools-logos';

export function useLogos() {
  const [logos, setLogos] = useState<Logo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [
      { id: 'logo1', url: '', name: 'Top Left' },
      { id: 'logo2', url: '', name: 'Top Right' },
      { id: 'logo3', url: '', name: 'Bottom Left' },
      { id: 'logo4', url: '', name: 'Bottom Right' }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
  }, [logos]);

  const updateLogo = (id: string, updates: Partial<Logo>) => {
    setLogos(current => 
      current.map(logo => 
        logo.id === id ? { ...logo, ...updates } : logo
      )
    );
  };

  return { logos, updateLogo };
}