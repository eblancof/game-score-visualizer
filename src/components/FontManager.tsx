import React, { useRef, useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useFonts } from '../hooks/useFonts';

const FontPreview: React.FC<{ family: string }> = ({ family }) => (
  <div className="grid grid-cols-2 gap-x-4 text-sm">
    <p style={{ fontFamily: family, fontWeight: 400 }}>Regular 400</p>
    <p style={{ fontFamily: family, fontWeight: 700 }}>Bold 700</p>
  </div>
);

const FontManager: React.FC = () => {
  const { fonts, addFont, removeFont } = useFonts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    if (file && (file.name.endsWith('.ttf') || file.name.endsWith('.otf'))) {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
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
          <input
            type="file"
            accept=".otf,.ttf"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            ref={fileInputRef}
          />

          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Google Fonts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fonts
                .filter(font => font.type === 'google')
                .map(font => (
                  <div
                    key={font.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{font.family}</p>
                        <Check className="w-4 h-4 text-primary" />
                      </div>
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
                    className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{font.family}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFont(font.id)}
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{font.source}</p>
                      <FontPreview family={font.family} />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div
            className={`text-center py-8 text-muted-foreground bg-muted rounded-lg border-2 border-dashed transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <p>Drag and drop .ttf or .otf files here</p>
              <p className="text-sm">or</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontManager;