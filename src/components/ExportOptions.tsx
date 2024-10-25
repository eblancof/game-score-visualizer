import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';

interface ExportOptionsProps {
  onExport: (resolution: number) => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport }) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant="outline"
        onClick={() => onExport(1080)}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export 1080x1080
      </Button>
      <Button
        variant="outline"
        onClick={() => onExport(2056)}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export 2056x2056
      </Button>
    </div>
  );
};

export default ExportOptions;