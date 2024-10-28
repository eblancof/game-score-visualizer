import React, { useState } from 'react';
import { ResolutionToggle } from './ResolutionToggle';
import { ExportButton } from './ExportButton';
import { downloadCard } from '../../utils/downloadCards';

export const ExportOptions: React.FC = () => {
  const [resolution, setResolution] = useState<1080 | 2056>(1080);

  const handleExportCurrent = async () => {
    const cardElement = document.querySelector('.game-card');
    if (cardElement) {
      await downloadCard(cardElement as HTMLElement, resolution);
    }
  };

  const handleExportAll = async () => {
    const cards = document.querySelectorAll('.game-card');
    for (let i = 0; i < cards.length; i++) {
      await downloadCard(cards[i] as HTMLElement, resolution, i + 1);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <ResolutionToggle 
        resolution={resolution} 
        onResolutionChange={setResolution} 
      />
      <div className="flex gap-2">
        <ExportButton onClick={handleExportCurrent}>
          Download Current
        </ExportButton>
        <ExportButton onClick={handleExportAll}>
          Download All
        </ExportButton>
      </div>
    </div>
  );
};