import React from 'react';
import { Button } from './ui/button';
import { Logo } from '../hooks/useLogos';
import { useLogos } from '../hooks/useLogos';

const LogoManager: React.FC = () => {
  const { logos, updateLogo } = useLogos();

  const handleFileChange = async (id: string, file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLogo(id, { url: reader.result as string });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border/50">
      <h2 className="text-lg font-semibold text-foreground mb-4">Corner Logos Configuration</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {logos.map((logo) => (
          <div key={logo.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-12 h-6 bg-muted rounded-lg overflow-hidden border border-border/50">
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
              <input
                type="text"
                value={logo.name}
                onChange={(e) => updateLogo(logo.id, { name: e.target.value })}
                className="flex-1 px-2 py-1 text-sm border border-border rounded-md bg-muted text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Logo name"
              />
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
                size="sm"
                className="w-full hover:bg-accent hover:text-accent-foreground border-border/50"
                onClick={() => document.getElementById(`logo-${logo.id}`)?.click()}
              >
                {logo.url ? 'Change' : 'Upload'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoManager;