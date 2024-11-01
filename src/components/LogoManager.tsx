import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { useLogos } from '../hooks/useLogos';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Logo } from '../hooks/useLogos';
import CornerLogos from './CornerLogos';
import LogoCropper from './LogoCropper';

const PreviewCard: React.FC<{
  logos: Logo[];
  onLogoPositionUpdate: (id: string, x: number, y: number) => void;
  selectedLogo: string | null;
  onLogoSelect: (id: string) => void;
}> = ({ logos, onLogoPositionUpdate, selectedLogo, onLogoSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 aspect-square" ref={containerRef}>
      <div className="w-full h-full flex flex-col justify-between">
        <CornerLogos
          logos={logos}
          section="top"
          className="h-[15%]"
          onPositionUpdate={onLogoPositionUpdate}
          selectedLogo={selectedLogo}
          onLogoSelect={onLogoSelect}
          containerWidth={containerWidth}
        />

        <div className="flex-1 mx-8 my-4 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          Game Information Preview Area
        </div>

        <CornerLogos
          logos={logos}
          section="bottom"
          className="h-[15%]"
          onPositionUpdate={onLogoPositionUpdate}
          selectedLogo={selectedLogo}
          onLogoSelect={onLogoSelect}
          containerWidth={containerWidth}
        />
      </div>
    </div>
  );
};

const LogoManager: React.FC = () => {
  const { logos, addLogo, updateLogo, removeLogo, updateLogoPosition } = useLogos();
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [cropImage, setCropImage] = useState<{ id: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!selectedLogo) return;
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCropImage({
            id: selectedLogo,
            url: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleCroppedLogo = (croppedImageUrl: string) => {
    if (cropImage) {
      updateLogo(cropImage.id, { url: croppedImageUrl });
      setCropImage(null);
    }
  };

  const handleAddLogo = (section: 'top' | 'bottom') => {
    const newLogoId = addLogo(section);
    setSelectedLogo(newLogoId);
  };

  const handleLogoSelect = (id: string) => {
    setSelectedLogo(id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Logo Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 items-start">
          <div className="w-full max-w-md mx-auto">
            <PreviewCard 
              logos={logos}
              onLogoPositionUpdate={updateLogoPosition}
              selectedLogo={selectedLogo}
              onLogoSelect={handleLogoSelect}
            />
          </div>

          <div className="w-full lg:w-64 space-y-4">
            <div className="bg-muted p-4 rounded-lg border border-border/50">
              <h3 className="font-medium mb-4">Add New Logo</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddLogo('top')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Top Section
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddLogo('bottom')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Bottom Section
                </Button>
              </div>
            </div>

            {selectedLogo && (
              <div className="bg-muted p-4 rounded-lg border border-border/50">
                <h3 className="font-medium mb-2">Selected Logo</h3>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                    className="hidden"
                    id="logo-upload"
                    ref={fileInputRef}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {logos.find(l => l.id === selectedLogo)?.url 
                      ? 'Change Image'
                      : 'Upload Image'
                    }
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      removeLogo(selectedLogo);
                      setSelectedLogo(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Logo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {cropImage && (
        <LogoCropper
          imageUrl={cropImage.url}
          onCrop={handleCroppedLogo}
          onCancel={() => setCropImage(null)}
        />
      )}
    </div>
  );
};

export default LogoManager;