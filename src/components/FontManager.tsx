import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Plus, Trash2, Check } from 'lucide-react';
import { useFonts } from '../hooks/useFonts';

const FontPreview: React.FC<{ family: string }> = ({ family }) => (
  <div className="space-y-1">
    <p className="font-medium" style={{ fontFamily: family, fontWeight: 400 }}>
      Regular 400
    </p>
    <p className="font-medium" style={{ fontFamily: family, fontWeight: 500 }}>
      Medium 500
    </p>
    <p className="font-medium" style={{ fontFamily: family, fontWeight: 600 }}>
      SemiBold 600
    </p>
    <p className="font-medium" style={{ fontFamily: family, fontWeight: 700 }}>
      Bold 700
    </p>
  </div>
);

const FontManager: React.FC = () => {
  const { fonts, addFont, removeFont } = useFonts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await addFont(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error adding font:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Font Settings</h2>
          <div className="text-sm text-muted-foreground">
            {fonts.length} fonts available
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <input
              type="file"
              accept=".otf,.ttf"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Font
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Google Fonts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fonts
                .filter(font => font.type === 'google')
                .map(font => (
                  <div
                    key={font.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{font.family}</p>
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Google Font</p>
                      <FontPreview family={font.family} />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Custom Fonts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fonts
                .filter(font => font.type === 'custom')
                .map(font => (
                  <div
                    key={font.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{font.family}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFont(font.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Custom Font • {font.source}
                      </p>
                      <FontPreview family={font.family} />
                    </div>
                  </div>
                ))}
              {fonts.filter(font => font.type === 'custom').length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground bg-muted rounded-lg border border-dashed border-border">
                  No custom fonts added yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontManager;