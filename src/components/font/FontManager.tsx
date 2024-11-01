import React, { useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useGoogleFonts, FontData } from '../../hooks/useGoogleFonts';
import FontPreview from './FontPreview';

const FontManager: React.FC = () => {
  const {
    fonts,
    savedFonts,
    loading,
    error,
    addFont,
    removeFont
  } = useGoogleFonts();
  const [search, setSearch] = useState('');
  const [selectedFont, setSelectedFont] = useState<FontData | null>(null);

  const filteredFonts = fonts.filter(font =>
    font.family.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading fonts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Font Settings</h2>
          <div className="text-sm text-muted-foreground">
            {savedFonts.length} fonts available
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8">
          {/* Font Browser */}
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search fonts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {filteredFonts.map(font => (
                <button
                  key={font.family}
                  onClick={() => setSelectedFont(font)}
                  className={`text-left p-4 rounded-lg transition-all duration-200 border border-border/50 hover:border-primary/50 ${
                    selectedFont?.family === font.family
                      ? 'bg-accent shadow-md'
                      : 'bg-card hover:bg-accent/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-foreground">{font.family}</span>
                    {savedFonts.includes(font.family) ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFont(font.family);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          addFont(font.family);
                        }}
                      >
                        <Plus className="w-4 h-4 text-primary" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{font.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Preview */}
          {selectedFont && (
            <div className="w-full lg:w-64">
              <FontPreview
                font={selectedFont}
                isAdded={savedFonts.includes(selectedFont.family)}
                onAdd={() => addFont(selectedFont.family)}
                onRemove={() => removeFont(selectedFont.family)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FontManager;