import React, { useRef, useState } from 'react';
import { TextElement } from '../hooks/useTextElements';
import TextElementControls from './TextElementControls';

interface MovableTextProps {
  element: TextElement;
  onUpdate: (id: string, updates: Partial<TextElement>) => void;
  onRemove: (id: string) => void;
}

const MovableText: React.FC<MovableTextProps> = ({ element, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    onUpdate(element.id, { text: e.target.textContent || element.text });
  };

  return (
    <div
      ref={textRef}
      className="relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        contentEditable={isEditing}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        suppressContentEditableWarning
        style={{
          fontFamily: element.fontFamily,
          fontSize: `${element.fontSize}px`,
          color: element.color,
          transform: `rotate(${element.rotation}deg)`,
          cursor: isEditing ? 'text' : 'move',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
        className="outline-none border-2 border-transparent focus:border-primary"
      >
        {element.text}
      </div>

      {showControls && !isEditing && (
        <TextElementControls
          element={element}
          onUpdate={onUpdate}
          onRemove={onRemove}
          parentRef={textRef}
        />
      )}

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-0 group-hover:opacity-100"
        style={{
          background: 'currentColor',
          transform: 'translate(50%, 50%)',
        }}
        onMouseDown={(e) => {
          // Add resize logic here
          const startX = e.clientX;
          const startSize = element.fontSize;
          
          const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startX;
            const newSize = Math.max(12, Math.min(72, startSize + dx / 2));
            onUpdate(element.id, { fontSize: newSize });
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      />
    </div>
  );
};

export default MovableText;
