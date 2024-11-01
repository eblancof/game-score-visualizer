import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Paintbrush, Type, RotateCcw, ChevronRight, Plus, Minus, Shield } from 'lucide-react';
import { TextColors } from '../hooks/useTextColors';
import { cn } from '../lib/utils';
import { useTextColors } from '../hooks/useTextColors';
import { useShieldSize } from '../hooks/useShieldSize';

interface ColorPickerProps {
  colors: TextColors;
  onColorChange: (key: keyof TextColors, color: string) => void;
  onReset: () => void;
}

type Tab = 'colors' | 'fonts' | 'shields';

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  onColorChange,
  onReset
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('colors');
  const pickerRef = useRef<HTMLDivElement>(null);
  const { 
    fonts, 
    updateFont, 
    updateFontSize,
    availableFonts,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE
  } = useTextColors();

  const {
    shieldSizes,
    updateShieldSize,
    resetSizes,
    MIN_SIZE,
    MAX_SIZE
  } = useShieldSize();

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
            <div className="grid grid-cols-3 w-full gap-1">
              <Button
                variant={activeTab === 'colors' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('colors')}
                className="h-8 px-2"
              >
                <Paintbrush className="w-4 h-4 mr-1" />
                <span className="truncate">Colors</span>
              </Button>
              <Button
                variant={activeTab === 'fonts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('fonts')}
                className="h-8 px-2"
              >
                <Type className="w-4 h-4 mr-1" />
                <span className="truncate">Fonts</span>
              </Button>
              <Button
                variant={activeTab === 'shields' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('shields')}
                className="h-8 px-2"
              >
                <Shield className="w-4 h-4 mr-1" />
                <span className="truncate">Size</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={activeTab === 'shields' ? resetSizes : onReset}
              className="h-8 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'colors' && (
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
          )}

          {activeTab === 'fonts' && (
            colorOptions.map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </label>
                <select
                  value={fonts[key as keyof TextColors].family}
                  onChange={(e) => updateFont(key as keyof TextColors, e.target.value)}
                  className="w-full px-2 py-1 rounded bg-muted border border-border text-sm"
                  style={{ fontFamily: fonts[key as keyof TextColors].family }}
                >
                  {availableFonts.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFontSize(key as keyof TextColors, -1)}
                    disabled={fonts[key as keyof TextColors].size <= MIN_FONT_SIZE}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center text-sm">
                    {Math.round(fonts[key as keyof TextColors].size)}px
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFontSize(key as keyof TextColors, 1)}
                    disabled={fonts[key as keyof TextColors].size >= MAX_FONT_SIZE}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

          {activeTab === 'shields' && (
            <>
              <div className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Local Team Shield</span>
                  <span className="text-xs text-muted-foreground">Size of the local team's shield</span>
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateShieldSize('local', shieldSizes.local - 5)}
                    disabled={shieldSizes.local <= MIN_SIZE}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center text-sm">
                    {shieldSizes.local}px
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateShieldSize('local', shieldSizes.local + 5)}
                    disabled={shieldSizes.local >= MAX_SIZE}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Visitor Team Shield</span>
                  <span className="text-xs text-muted-foreground">Size of the visitor team's shield</span>
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateShieldSize('visitor', shieldSizes.visitor - 5)}
                    disabled={shieldSizes.visitor <= MIN_SIZE}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center text-sm">
                    {shieldSizes.visitor}px
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateShieldSize('visitor', shieldSizes.visitor + 5)}
                    disabled={shieldSizes.visitor >= MAX_SIZE}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;