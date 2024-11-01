import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Paintbrush, Type, RotateCcw, ChevronRight } from 'lucide-react';
import { TextColors } from '../hooks/useTextColors';
import { cn } from '../lib/utils';
import { useGoogleFonts } from '../hooks/useGoogleFonts';

interface ColorPickerProps {
  colors: TextColors;
  onColorChange: (key: keyof TextColors, color: string) => void;
  onReset: () => void;
}

type Tab = 'colors' | 'fonts';

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  onColorChange,
  onReset
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('colors');
  const pickerRef = useRef<HTMLDivElement>(null);
  const { fonts, selectedFonts, updateFont, resetFonts } = useGoogleFonts();

  const colorOptions = [
    { key: 'competition', label: 'Competition', description: 'Competition name color' },
    { key: 'dateTime', label: 'Date & Time', description: 'Date and time color' },
    { key: 'teamName', label: 'Teams', description: 'Team names color' },
    { key: 'score', label: 'Score', description: 'Score numbers color' },
  ];

  const handleColorChange = (key: keyof TextColors, value: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onColorChange(key, value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={cn(
        "fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300",
        !isOpen && "translate-x-full"
      )}
      ref={pickerRef}
    >
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 rounded-l-lg rounded-r-none h-24 w-8 bg-primary/90 hover:bg-primary shadow-lg"
      >
        <ChevronRight className={cn(
          "w-4 h-4 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </Button>

      <div className="w-72 bg-card/95 backdrop-blur-sm shadow-lg rounded-l-lg border-l border-y border-border h-[80vh] flex flex-col">
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'colors' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('colors')}
                className="h-8"
              >
                <Paintbrush className="w-4 h-4 mr-2" />
                Colors
              </Button>
              <Button
                variant={activeTab === 'fonts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('fonts')}
                className="h-8"
              >
                <Type className="w-4 h-4 mr-2" />
                Fonts
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={activeTab === 'colors' ? onReset : resetFonts}
              className="h-8"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'colors' ? (
            // Colors Tab
            colorOptions.map(({ key, label, description }) => (
              <div
                key={key}
                className="space-y-2"
              >
                <label className="flex flex-col">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={colors[key as keyof TextColors] || '#000000'}
                      onChange={(e) => handleColorChange(key as keyof TextColors, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <div className="absolute inset-0 rounded ring-1 ring-border pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    value={colors[key as keyof TextColors] || '#000000'}
                    onChange={(e) => handleColorChange(key as keyof TextColors, e.target.value)}
                    className="flex-1 px-2 py-1 text-xs rounded bg-muted border border-border font-mono"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))
          ) : (
            // Fonts Tab
            colorOptions.map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </label>
                <select
                  value={selectedFonts[key]}
                  onChange={(e) => updateFont(key, e.target.value)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;