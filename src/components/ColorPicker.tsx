import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Paintbrush, Type, RotateCcw, ChevronRight, Shield } from 'lucide-react';
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
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    fonts, 
    updateFont,
    updateFontSize,
    updateFontWeight,
    updateTextShadow,
    scoreBackground,
    updateScoreBackground,
    shieldSettings,
    updateShieldSettings,
    availableFonts,
    availableWeights,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE
  } = useTextColors();

  const {
    shieldSize,
    updateShieldSize,
    resetSize,
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

  const handleFontSizeChange = (key: keyof TextColors, value: number) => {
    const currentSize = fonts[key].size;
    const change = value - currentSize;
    updateFontSize(key, change);
  };

  const handleShadowChange = (key: keyof TextColors, value: number) => {
    const shadow = `2px 2px ${value}px rgba(0, 0, 0, 0.2)`;
    updateTextShadow(key, shadow);
  };

  const handleShieldShadowChange = (value: number) => {
    const shadow = `2px 4px ${value}px rgba(0, 0, 0, 0.2)`;
    updateShieldSettings({ dropShadow: shadow });
  };

  const getShadowSize = (shadow: string) => {
    const match = shadow.match(/(\d+)px/);
    return match ? parseInt(match[1]) : 4;
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
            <div 
              className="relative flex-1 overflow-hidden before:absolute before:left-0 before:w-4 before:h-full before:bg-gradient-to-r before:from-muted/50 before:to-transparent after:absolute after:right-0 after:w-4 after:h-full after:bg-gradient-to-l after:from-muted/50 after:to-transparent"
              ref={tabsContainerRef}
            >
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                <Button
                  variant={activeTab === 'colors' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('colors')}
                  className={cn(
                    "h-8 px-3 transition-all duration-200",
                    activeTab === 'colors' ? 'shadow-md' : 'hover:bg-accent/50'
                  )}
                >
                  <Paintbrush className="w-4 h-4 mr-2" />
                  Colors
                </Button>
                <Button
                  variant={activeTab === 'fonts' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('fonts')}
                  className={cn(
                    "h-8 px-3 transition-all duration-200",
                    activeTab === 'fonts' ? 'shadow-md' : 'hover:bg-accent/50'
                  )}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Fonts
                </Button>
                <Button
                  variant={activeTab === 'shields' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('shields')}
                  className={cn(
                    "h-8 px-3 transition-all duration-200",
                    activeTab === 'shields' ? 'shadow-md' : 'hover:bg-accent/50'
                  )}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Shields
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={activeTab === 'shields' ? resetSize : onReset}
              className="h-8 ml-2 flex-shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'colors' && (
            <>
              {colorOptions.map(({ key, label, description }) => (
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
              ))}

              <div className="space-y-2 pt-4 border-t border-border">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Score Background</span>
                  <span className="text-xs text-muted-foreground">Background color for scores</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={scoreBackground.color}
                      onChange={(e) => updateScoreBackground({ color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <div className="absolute inset-0 rounded ring-1 ring-border pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    value={scoreBackground.color}
                    onChange={(e) => updateScoreBackground({ color: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs rounded bg-muted border border-border font-mono"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Opacity: {Math.round(scoreBackground.opacity * 100)}%</span>
                    <span>0% - 100%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scoreBackground.opacity * 100}
                    onChange={(e) => updateScoreBackground({ opacity: Number(e.target.value) / 100 })}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </>
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
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Font Weight</label>
                  <select
                    value={fonts[key as keyof TextColors].weight}
                    onChange={(e) => updateFontWeight(key as keyof TextColors, Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-muted border border-border text-sm"
                  >
                    {availableWeights.map((weight) => (
                      <option key={weight} value={weight}>
                        {weight}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Size: {Math.round(fonts[key as keyof TextColors].size)}px</span>
                    <span>{MIN_FONT_SIZE}px - {MAX_FONT_SIZE}px</span>
                  </div>
                  <input
                    type="range"
                    min={MIN_FONT_SIZE}
                    max={MAX_FONT_SIZE}
                    value={fonts[key as keyof TextColors].size}
                    onChange={(e) => handleFontSizeChange(key as keyof TextColors, Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Text Shadow: {getShadowSize(fonts[key as keyof TextColors].textShadow)}px</span>
                    <span>0px - 10px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={getShadowSize(fonts[key as keyof TextColors].textShadow)}
                    onChange={(e) => handleShadowChange(key as keyof TextColors, Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            ))
          )}

          {activeTab === 'shields' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Shield Size</span>
                  <span className="text-xs text-muted-foreground">Size of team shields</span>
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Size: {shieldSize}px</span>
                    <span>{MIN_SIZE}px - {MAX_SIZE}px</span>
                  </div>
                  <input
                    type="range"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    value={shieldSize}
                    onChange={(e) => updateShieldSize(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Shield Shadow</span>
                  <span className="text-xs text-muted-foreground">Shadow intensity for shields</span>
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shadow: {getShadowSize(shieldSettings.dropShadow)}px</span>
                    <span>0px - 10px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={getShadowSize(shieldSettings.dropShadow)}
                    onChange={(e) => handleShieldShadowChange(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;