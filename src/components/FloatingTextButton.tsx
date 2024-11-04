import React from 'react';
import { Plus, Type } from 'lucide-react';
import { Button } from './ui/button';

interface FloatingTextButtonProps {
  onClick: () => void;
}

const FloatingTextButton: React.FC<FloatingTextButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 bg-primary text-primary-foreground"
    >
      <Type className="w-6 h-6" />
    </Button>
  );
};

export default FloatingTextButton;