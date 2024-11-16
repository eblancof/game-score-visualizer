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
  const [rotateStart, setRotateStart] = useState(0);

  const [{ x, y }, api] = useSpring(() => ({
    x: element.position.x * containerScale,
    y: element.position.y * containerScale,
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
    from: () => [x.get(), y.get()]
  });

  const handleRotateStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setRotateStart(Math.atan2(clientY - centerY, clientX - centerX));
    }
  };

  const handleRotateMove = (e: MouseEvent | TouchEvent) => {
    if (!isRotating) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX);
      const rotation = ((angle - rotateStart) * 180) / Math.PI;
      onUpdate(element.id, { rotation: element.rotation + rotation });
      setRotateStart(angle);
    }
  };

  const handleRotateEnd = () => {
    setIsRotating(false);
  };

  React.useEffect(() => {
    if (isRotating) {
      window.addEventListener('mousemove', handleRotateMove);
      window.addEventListener('mouseup', handleRotateEnd);
      window.addEventListener('touchmove', handleRotateMove);
      window.addEventListener('touchend', handleRotateEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleRotateMove);
      window.removeEventListener('mouseup', handleRotateEnd);
      window.removeEventListener('touchmove', handleRotateMove);
      window.removeEventListener('touchend', handleRotateEnd);
    };
  }, [isRotating]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      onSelect(element.id, {
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
        }}
      >
        {element.text}
      </div>

      {isSelected && (
        <>
          <div
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            onMouseDown={handleRotateStart}
            onTouchStart={handleRotateStart}
          >
            <RotateCw className="w-3 h-3" />
          </div>
        </>
      )}
    </animated.div>
  );
};

export default TextElement;