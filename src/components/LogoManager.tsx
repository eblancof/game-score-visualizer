import React from 'react';
import { Button } from './ui/button';
import { Logo } from '../hooks/useLogos';

interface LogoManagerProps {
  logos: Logo[];
  onLogoUpdate: (id: string, updates: Partial<Logo>) => void;
}

const LogoManager: React.FC<LogoManagerProps> = ({ logos, onLogoUpdate }) => {
  const handleFileChange = async (id: string, file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoUpdate(id, { url: reader.result as string });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border/50">
      <h2 className="text-lg font-semibold text-foreground mb-4">Corner Logos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {logos.map((logo) => (
          <div key={logo.id} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-8 bg-muted rounded-full overflow-hidden border border-border/50">
                {logo.url ? (
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No logo
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {logo.name}
                </label>
                <input
                  type="text"
                  value={logo.name}
                  onChange={(e) => onLogoUpdate(logo.id, { name: e.target.value })}
                  className="w-full px-3 py-1 text-sm border border-border rounded-md bg-muted text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Logo name"
                />
              </div>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(logo.id, file);
                }}
                className="hidden"
                id={`logo-${logo.id}`}
              />
              <Button
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground border-border/50"
                onClick={() => document.getElementById(`logo-${logo.id}`)?.click()}
              >
                {logo.url ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoManager;