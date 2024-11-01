import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ImagePlus, Image as ImageIcon, Type } from 'lucide-react';
import { Button } from '../ui/button';
import { Container } from '../ui/container';
import { Tool } from '../../types/tool';

interface HeaderProps {
  tools: Tool[];
}

export const Header: React.FC<HeaderProps> = ({ tools }) => {
  const location = useLocation();
  const currentTool = tools.find(tool => location.pathname.startsWith(tool.path));

  return (
    <header className="border-b border-border/50 bg-card/50">
      <Container className="py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-semibold hover:text-primary transition-colors">
            Basketball Tools
          </Link>
          {currentTool && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-accent-foreground">{currentTool.name}</span>
            </>
          )}
          {location.pathname === '/settings' && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-accent-foreground">Logo Settings</span>
            </>
          )}
          {location.pathname === '/backgrounds' && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-accent-foreground">Background Settings</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/backgrounds">
            <Button variant="ghost" size="icon">
              <ImageIcon className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <ImagePlus className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
};