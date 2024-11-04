import React from 'react';
import { Button } from './ui/button';
import { Type } from 'lucide-react';

interface AddTextButtonProps {
  onClick: () => void;
}

export const AddTextButton: React.FC<AddTextButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="secondary"
      size="lg"
      className="fixed bottom-6 right-6 shadow-lg"
      onClick={onClick}
    >
      <Type className="w-5 h-5 mr-2" />
      Add Text
    </Button>
  );
};