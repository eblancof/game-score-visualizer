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
      className="fixed z-50 w-80 bg-card shadow-lg rounded-lg border border-border"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, calc(-100% - 10px))'
      }}
    >
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted">
        <h3 className="text-sm font-medium">Text Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Text</label>
          <input
            type="text"
            value={element.text}
            onChange={(e) => onUpdate(element.id, { text: e.target.value })}
            className="w-full px-2 py-1 rounded bg-muted border border-border text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Font Family</label>
          <select
            value={element.fontFamily}
            onChange={(e) => onUpdate(element.id, { fontFamily: e.target.value })}
            className="w-full px-2 py-1 rounded bg-muted border border-border text-sm"
          >
            {availableFonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="color"
                value={element.color}
                onChange={(e) => onUpdate(element.id, { color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <div className="absolute inset-0 rounded ring-1 ring-border pointer-events-none" />
            </div>
            <input
              type="text"
              value={element.color}
              onChange={(e) => onUpdate(element.id, { color: e.target.value })}
              className="flex-1 px-2 py-1 text-xs rounded bg-muted border border-border font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Font Size</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdate(element.id, { fontSize: Math.max(12, element.fontSize - 2) })}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">{element.fontSize}px</div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdate(element.id, { fontSize: Math.min(72, element.fontSize + 2) })}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Rotation</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdate(element.id, { rotation: element.rotation - 15 })}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">{element.rotation}°</div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdate(element.id, { rotation: element.rotation + 15 })}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            onRemove(element.id);
            onClose();
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Text
        </Button>
      </div>
    </div>
  );
};

export default TextElementControls;