import React from 'react';
import { Header } from './Header';
import { Container } from '../ui/container';
import { Tool } from '../../types/tool';

interface LayoutProps {
  tools: Tool[];
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ tools, children }) => (
  <div className="min-h-screen bg-background">
    <Header tools={tools} />
    <Container className="py-8">
      {children}
    </Container>
  </div>
);