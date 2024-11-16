import React from 'react';
import { Button } from './ui/button';
import { Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { TextElement } from '../hooks/useTextElements';
import { useTextColors } from '../hooks/useTextColors';

interface TextElementControlsProps {
  element: TextElement;
  onUpdate: (id: string, updates: Partial<TextElement>) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const TextElementControls: React.FC<TextElementControlsProps> = ({
  element,
  onUpdate,
  onRemove,
  onClose,
  position,
}) => {
  const { availableFonts } = useTextColors();

  return (
    <div 
      className="fixed z-50 bg-card shadow-lg rounded-lg border border-border flex items-center p-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, calc(-100% - 10px))'
      }}
    >
      <select
        aria-label="Font family"
        value={element.fontFamily}
        onChange={(e) => onUpdate(element.id, { fontFamily: e.target.value })}
        className="w-32 px-2 py-1 rounded bg-muted border border-border text-sm mx-2"
      >
        {availableFonts.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>

      <input
        type="color"
        value={element.color}
        onChange={(e) => onUpdate(element.id, { color: e.target.value })}
        className="w-8 h-8 rounded mx-2"
      />

      <div className="flex items-center gap-1 mx-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdate(element.id, { textAlign: 'left' })}
          className={element.textAlign === 'left' ? 'bg-accent' : ''}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdate(element.id, { textAlign: 'center' })}
          className={element.textAlign === 'center' ? 'bg-accent' : ''}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdate(element.id, { textAlign: 'right' })}
          className={element.textAlign === 'right' ? 'bg-accent' : ''}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdate(element.id, { textAlign: 'justify' })}
          className={element.textAlign === 'justify' ? 'bg-accent' : ''}
        >
          <AlignJustify className="w-4 h-4" />
        </Button>
      </div>

      <Button
        variant="destructive"
        size="icon"
        onClick={() => {
          onRemove(element.id);
          onClose();
        }}
        className="h-8 w-8 mx-2"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TextElementControls;