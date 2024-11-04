import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { TextElement } from '../hooks/useTextElements';
import { Button } from './ui/button';
import { Trash2, Type } from 'lucide-react';

interface TextOverlayProps {
  elements: TextElement[];
  onUpdate: (id: string, updates: Partial<TextElement>) => void;
  onRemove: (id: string) => void;
  containerScale: number;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  elements,
  onUpdate,
  onRemove,
  containerScale
}) => {
  const dragControls = useDragControls();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          className="absolute pointer-events-auto cursor-move group"
          style={{
            x: element.position.x,
            y: element.position.y,
            rotate: element.rotation,
            transformOrigin: 'center center',
            touchAction: 'none'
          }}
          onDragEnd={(_, info) => {
            onUpdate(element.id, {
              position: {
                x: element.position.x + info.offset.x / containerScale,
                y: element.position.y + info.offset.y / containerScale
              }
            });
          }}
        >
          <div className="relative">
            <div
              contentEditable
              suppressContentEditableWarning
              className="min-w-[50px] outline-none"
              style={{
                fontSize: `${element.fontSize}px`,
                fontFamily: element.fontFamily,
                color: element.color
              }}
              onBlur={(e) => {
                onUpdate(element.id, { text: e.currentTarget.textContent || 'New Text' });
              }}
            >
              {element.text}
            </div>
            <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemove(element.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <input
                type="color"
                value={element.color}
                onChange={(e) => onUpdate(element.id, { color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer"
              />
              <select
                value={element.fontSize}
                onChange={(e) => onUpdate(element.id, { fontSize: Number(e.target.value) })}
                className="h-6 px-1 rounded text-xs bg-secondary"
              >
                {[12, 14, 16, 20, 24, 32, 48, 64].map(size => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};