import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { useBackgrounds } from '../hooks/useBackgrounds';
import ImageCropper from './ImageCropper';

const BackgroundManager: React.FC = () => {
  const {
    backgrounds,
    selectedBackground,
    addBackground,
    removeBackground,
    selectBackground,
    updateBackgroundOpacity
  } = useBackgrounds();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropImage, setCropImage] = useState<{ id: string; url: string } | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage({
          id: `temp-${Date.now()}`,
          url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCroppedImage = async (croppedImageUrl: string) => {
    if (cropImage) {
      await addBackground(dataURLtoFile(croppedImageUrl, 'cropped-image.png'));
      setCropImage(null);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Background Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Background
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {backgrounds.map((background) => (
              <div
                key={background.id}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                  selectedBackground === background.id
                    ? 'border-primary'
                    : 'border-border'
                }`}
                onClick={() => selectBackground(background.id)}
              >
                <img
                  src={background.url}
                  alt={background.name}
                  className="w-full h-full object-cover"
                  style={{ opacity: background.opacity }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 space-y-2">
                  <div className="flex items-center justify-between text-white text-xs mb-1 px-1">
                    <span>Opacity</span>
                    <span>{Math.round((background.opacity ?? 0.15) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(background.opacity ?? 0.15) * 100}
                    onChange={(e) => updateBackgroundOpacity(background.id, Number(e.target.value) / 100)}
                    className="w-full accent-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBackground(background.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {backgrounds.length > 0 && (
            <Button
              variant="outline"
              onClick={() => selectBackground(null)}
              className="mt-4"
            >
              Unselect Background
            </Button>
          )}
        </div>
      </div>

      {cropImage && (
        <ImageCropper
          imageUrl={cropImage.url}
          onCrop={handleCroppedImage}
          onCancel={() => setCropImage(null)}
        />
      )}
    </div>
  );
};

export default BackgroundManager;