import React from 'react';
import { Button } from '../ui/button';

interface ResolutionToggleProps {
  resolution: 1080 | 2056;
  onResolutionChange: (resolution: 1080 | 2056) => void;
}

export const ResolutionToggle: React.FC<ResolutionToggleProps> = ({ 
  resolution, 
  onResolutionChange 
}) => (
  <div className="flex gap-2">
    <Button
      variant={resolution === 1080 ? "default" : "outline"}
      onClick={() => onResolutionChange(1080)}
      className="whitespace-nowrap"
    >
      1080x1080
    </Button>
    <Button
      variant={resolution === 2056 ? "default" : "outline"}
      onClick={() => onResolutionChange(2056)}
      className="whitespace-nowrap"
    >
      2056x2056
    </Button>
  </div>
);