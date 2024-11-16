import React from 'react';
import { Button } from './ui/button';
import { Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Plus, Bold, Italic } from 'lucide-react';
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
  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 72;

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.min(Math.max(MIN_FONT_SIZE, element.fontSize + delta), MAX_FONT_SIZE);
    onUpdate(element.id, { fontSize: newSize });
  };

  return (
    <div 
      className="fixed z-50 bg-card shadow-lg rounded-lg border border-border flex flex-col p-2 min-w-[240px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, calc(-100% - 8px))',
        transition: 'left 0.1s, top 0.1s'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <select
          aria-label="Font family"
          value={element.fontFamily}
          onChange={(e) => onUpdate(element.id, { fontFamily: e.target.value })}
          className="flex-1 px-2 py-1 rounded bg-muted border border-border text-sm"
        >
          {availableFonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFontSizeChange(-2)}
            disabled={element.fontSize <= MIN_FONT_SIZE}
            className="h-7 w-7"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm min-w-[3ch] text-center">{element.fontSize}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFontSizeChange(2)}
            disabled={element.fontSize >= MAX_FONT_SIZE}
            className="h-7 w-7"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <input
          type="color"
          value={element.color}
          onChange={(e) => onUpdate(element.id, { color: e.target.value })}
          className="w-8 h-8 rounded"
        />

        <div className="flex items-center gap-1 flex-1">
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
          <Button
            variant={element.fontWeight === 'bold' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onUpdate(element.id, { fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
            className="h-8 w-8"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={element.fontStyle === 'italic' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onUpdate(element.id, { fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className="h-8 w-8"
          >
            <Italic className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            onRemove(element.id);
            onClose();
          }}
          className="h-8 w-8"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TextElementControls;