import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FontData } from '../../hooks/useGoogleFonts';
import WebFont from 'webfontloader';

interface FontPreviewProps {
  font: FontData;
  isAdded: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

const FontPreview: React.FC<FontPreviewProps> = ({
  font,
  isAdded,
  onAdd,
  onRemove
}) => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: [font.family]
      }
    });
  }, [font.family]);

  return (
    <div className="bg-muted p-4 rounded-lg border border-border/50">
      <h3 className="font-medium mb-4">Font Preview</h3>
      
      <div className="space-y-4">
        <div
          className="p-3 bg-background rounded border border-border"
          style={{ fontFamily: font.family }}
        >
          <p className="text-2xl mb-2">Aa Bb Cc</p>
          <p className="text-sm">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Font Details</p>
          <div className="text-xs space-y-1">
            <p><span className="font-medium">Family:</span> {font.family}</p>
            <p><span className="font-medium">Category:</span> {font.category}</p>
            <p><span className="font-medium">Variants:</span> {font.variants.length}</p>
          </div>
        </div>

        <Button
          variant={isAdded ? "destructive" : "default"}
          size="sm"
          className="w-full"
          onClick={isAdded ? onRemove : onAdd}
        >
          {isAdded ? (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Font
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Font
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FontPreview;