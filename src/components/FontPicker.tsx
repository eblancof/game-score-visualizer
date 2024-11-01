import React from 'react';
import { Button } from './ui/button';
import { Type, RotateCcw } from 'lucide-react';

interface FontPickerProps {
  fonts: { family: string }[];
  selectedFonts: Record<string, string>;
  onFontChange: (element: string, font: string) => void;
  onReset: () => void;
}

const FontPicker: React.FC<FontPickerProps> = ({
  fonts,
  selectedFonts,
  onFontChange,
  onReset
}) => {
  const elements = [
    { key: 'competition', label: 'Competition', description: 'Competition name font' },
    { key: 'dateTime', label: 'Date & Time', description: 'Date and time font' },
    { key: 'teamName', label: 'Teams', description: 'Team names font' },
    { key: 'score', label: 'Score', description: 'Score numbers font' },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300">
      <div className="w-72 bg-card/95 backdrop-blur-sm shadow-lg rounded-l-lg border-l border-y border-border h-[80vh] flex flex-col">
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Settings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-2"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Customize fonts for different elements
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {elements.map(({ key, label, description }) => (
            <div key={key} className="space-y-2">
              <label className="flex flex-col">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </label>
              <select
                value={selectedFonts[key]}
                onChange={(e) => onFontChange(key, e.target.value)}
                className="w-full px-2 py-1 rounded bg-muted border border-border text-sm"
              >
                {fonts.map((font) => (
                  <option
                    key={font.family}
                    value={font.family}
                    style={{ fontFamily: font.family }}
                  >
                    {font.family}
                  </option>
                ))}
              </select>
              <div
                className="text-sm p-2 bg-background rounded border border-border"
                style={{ fontFamily: selectedFonts[key] }}
              >
                Preview Text
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontPicker;