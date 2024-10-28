import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';

interface ExportButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick, children }) => (
  <Button
    variant="outline"
    onClick={onClick}
    className="flex items-center gap-2 whitespace-nowrap"
  >
    <Download className="w-4 h-4" />
    {children}
  </Button>
);