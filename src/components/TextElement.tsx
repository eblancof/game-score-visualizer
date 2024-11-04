import React, { useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import { TextElement as TextElementType } from '../hooks/useTextElements';

interface TextElementProps {
  element: TextElementType;
  onUpdate: (id: string, updates: Partial<TextElementType>) => void;
  onSelect: (id: string, position: { x: number; y: number }) => void;
  isSelected: boolean;
  containerScale: number;
}

export const TextElement: React.FC<TextElementProps> = ({
  element,
  onUpdate,
  onSelect,
  isSelected,
  containerScale,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [{ x, y }, api] = useSpring(() => ({
    x: element.position.x,
    y: element.position.y,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(({ offset: [ox, oy], last }) => {
    const scaledX = ox / containerScale;
    const scaledY = oy / containerScale;
    
    // Constrain movement to card boundaries (1080x1080)
    const boundedX = Math.max(-540, Math.min(540, scaledX));
    const boundedY = Math.max(-540, Math.min(540, scaledY));
    
    api.start({ 
      x: boundedX * containerScale, 
      y: boundedY * containerScale, 
      immediate: true 
    });
    
    if (last) {
      onUpdate(element.id, { position: { x: boundedX, y: boundedY } });
    }
  }, {
    from: () => [x.get(), y.get()],
    transform: ([x, y]) => [x * containerScale, y * containerScale]
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      onSelect(element.id, {
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  };

  return (
    <animated.div
      ref={elementRef}
      {...bind()}
      onClick={handleClick}
      style={{
        x,
        y,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'move',
        userSelect: 'none',
        padding: '4px',
        borderRadius: '4px',
        border: isSelected ? '2px solid hsl(var(--primary))' : '2px solid transparent',
      }}
    >
      <div
        style={{
          color: element.color,
          fontFamily: element.fontFamily,
          fontSize: `${element.fontSize}px`,
          transform: `rotate(${element.rotation}deg)`,
        }}
      >
        {element.text}
      </div>
    </animated.div>
  );
};

export default TextElement;