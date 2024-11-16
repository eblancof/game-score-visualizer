import React, { useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import { TextElement as TextElementType } from '../hooks/useTextElements';
import { RotateCw } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const [{ x, y }, api] = useSpring(() => ({
    x: element.position.x * containerScale,
    y: element.position.y * containerScale,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(({ offset: [ox, oy], last, event, first }) => {
    if (isRotating) return;
    event?.stopPropagation();

    const scaledX = ox / containerScale;
    const scaledY = oy / containerScale;
    
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

    if (first || last) {
      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        onSelect(element.id, {
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
    }
  }, {
    from: () => [x.get(), y.get()],
    enabled: !isEditing
  });

  const handleRotation = (e: MouseEvent | TouchEvent) => {
    if (!isRotating || !elementRef.current) return;
    e.preventDefault();
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    const degrees = (angle * 180) / Math.PI;
    
    onUpdate(element.id, { rotation: degrees + 90 });
  };

  const handleRotateStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    document.addEventListener('mousemove', handleRotation);
    document.addEventListener('touchmove', handleRotation);
    document.addEventListener('mouseup', handleRotateEnd);
    document.addEventListener('touchend', handleRotateEnd);
  };

  const handleRotateEnd = () => {
    setIsRotating(false);
    document.removeEventListener('mousemove', handleRotation);
    document.removeEventListener('touchmove', handleRotation);
    document.removeEventListener('mouseup', handleRotateEnd);
    document.removeEventListener('touchend', handleRotateEnd);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        onSelect(element.id, {
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    onUpdate(element.id, { text: e.target.textContent || element.text });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
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
        cursor: isEditing ? 'text' : 'move',
        userSelect: 'none',
        padding: '4px',
        borderRadius: '4px',
        border: isSelected ? '2px solid hsl(var(--primary))' : '2px solid transparent',
      }}
    >
      <div
        contentEditable={isEditing}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
        style={{
          color: element.color,
          fontFamily: element.fontFamily,
          fontSize: `${element.fontSize}px`,
          transform: `rotate(${element.rotation}deg)`,
          textAlign: element.textAlign || 'left',
          minWidth: '50px',
          outline: 'none',
          whiteSpace: 'pre-wrap',
        }}
      >
        {element.text}
      </div>

      {isSelected && (
        <div
          className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          onMouseDown={handleRotateStart}
          onTouchStart={handleRotateStart}
        >
          <RotateCw className="w-3 h-3" />
        </div>
      )}
    </animated.div>
  );
};

export default TextElement;