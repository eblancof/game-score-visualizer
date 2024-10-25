import React from 'react';
import { Grid, Columns } from 'lucide-react';
import { Button } from './ui/button';

interface ViewToggleProps {
  view: 'slider' | 'list';
  onViewChange: (view: 'slider' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={view === 'slider' ? 'default' : 'outline'}
        onClick={() => onViewChange('slider')}
        className="flex items-center gap-2"
      >
        <Grid className="w-4 h-4" />
        Slider View
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'outline'}
        onClick={() => onViewChange('list')}
        className="flex items-center gap-2"
      >
        <Columns className="w-4 h-4" />
        List View
      </Button>
    </div>
  );
};

export default ViewToggle;