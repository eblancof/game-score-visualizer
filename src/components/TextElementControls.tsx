import React from 'react';
import { Button } from './ui/button';
import { Trash2, RotateCcw, RotateCw, Minus, Plus, X } from 'lucide-react';
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
      <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
        <X className="w-4 h-4" />
      </Button>

      <input
        type="text"
        value={element.text}
        onChange={(e) => onUpdate(element.id, { text: e.target.value })}
        className="w-24 px-2 py-1 rounded bg-muted border border-border text-sm mx-2"
        placeholder="Texto"
      />

      <select
        aria-label="Fuente"
        value={element.fontFamily}
        onChange={(e) => onUpdate(element.id, { fontFamily: e.target.value })}
        className="w-24 px-2 py-1 rounded bg-muted border border-border text-sm mx-2"
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

      <div className="flex items-center mx-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdate(element.id, { fontSize: Math.max(12, element.fontSize - 2) })}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="px-2 text-sm">{element.fontSize}px</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdate(element.id, { fontSize: Math.min(72, element.fontSize + 2) })}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center mx-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdate(element.id, { rotation: element.rotation - 15 })}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <div className="px-2 text-sm">{element.rotation}°</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdate(element.id, { rotation: element.rotation + 15 })}
        >
          <RotateCw className="w-4 h-4" />
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
