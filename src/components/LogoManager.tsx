import React, { useState } from 'react';
import { Button } from './ui/button';
import { useLogos } from '../hooks/useLogos';
import { Plus, Trash2, Move } from 'lucide-react';
import { Logo } from '../hooks/useLogos';
import CornerLogos from './CornerLogos';

const PreviewCard: React.FC<{
  logos: Logo[];
  onLogoPositionUpdate: (id: string, x: number, y: number) => void;
  isEditing: boolean;
}> = ({ logos, onLogoPositionUpdate, isEditing }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 aspect-square">
      <div className="w-full h-full flex flex-col justify-between">
        <CornerLogos
          logos={logos}
          section="top"
          className="h-[15%]"
          onPositionUpdate={onLogoPositionUpdate}
          isEditing={isEditing}
        />

        <div className="flex-1 mx-8 my-4 bg-gray-100 rounded-lg"></div>

        <CornerLogos
          logos={logos}
          section="bottom"
          className="h-[15%]"
          onPositionUpdate={onLogoPositionUpdate}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

const LogoManager: React.FC = () => {
  const { logos, addLogo, updateLogo, removeLogo, updateLogoPosition } = useLogos();
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!selectedLogo) return;
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLogo(selectedLogo, { url: reader.result as string });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleAddLogo = (section: 'top' | 'bottom') => {
    const newLogoId = addLogo(section);
    setSelectedLogo(newLogoId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Logo Settings</h2>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Move className="w-4 h-4" />
            {isEditing ? "Save Positions" : "Edit Positions"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 items-start">
          <div className="w-full max-w-md mx-auto">
            <PreviewCard 
              logos={logos}
              onLogoPositionUpdate={updateLogoPosition}
              isEditing={isEditing}
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
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => document.getElementById('logo-upload')?.click()}
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
    </div>
  );
};

export default LogoManager;