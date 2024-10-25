import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { downloadCard } from '../utils/downloadCards';

const SingleGameExport: React.FC = () => {
  const [resolution, setResolution] = useState<1080 | 2056>(1080);

  const handleExport = async () => {
    const cardElement = document.querySelector('.game-card');
    if (cardElement) {
      await downloadCard(cardElement as HTMLElement, resolution);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <div className="flex gap-2">
        <Button
          variant={resolution === 1080 ? "default" : "outline"}
          onClick={() => setResolution(1080)}
          className="whitespace-nowrap"
        >
          1080x1080
        </Button>
        <Button
          variant={resolution === 2056 ? "default" : "outline"}
          onClick={() => setResolution(2056)}
          className="whitespace-nowrap"
        >
          2056x2056
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download Card
      </Button>
    </div>
  );
};

export default SingleGameExport;