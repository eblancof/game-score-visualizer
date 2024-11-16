import { useState, useCallback } from 'react';

export interface TextElement {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  color: string;
  rotation: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export function useTextElements() {
  const [elements, setElements] = useState<TextElement[]>([]);

  const addElement = useCallback(() => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      text: 'New Text',
      position: { x: 0, y: 0 },
      fontSize: 24,
      fontFamily: 'Montserrat',
      color: '#000000',
      rotation: 0,
      textAlign: 'left'
    };
    setElements(prev => [...prev, newElement]);
    return newElement.id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setElements(prev =>
      prev.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements(prev => prev.filter(element => element.id !== id));
  }, []);

  return {
    elements,
    addElement,
    updateElement,
    removeElement
  };
}