import React from 'react';
import { useState } from 'react';
import ToolSelector from './components/ToolSelector';
import GameScoreVisualizer from './tools/GameScoreVisualizer';
import SingleGameVisualizer from './tools/SingleGameVisualizer';
import LogoManager from './components/LogoManager';
import { Settings } from 'lucide-react';
import { Button } from './components/ui/button';

export type Tool = {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
};

const tools: Tool[] = [
  {
    id: 'game-score-visualizer',
    name: 'Game Score Visualizer',
    description: 'Create beautiful game score visualizations for social media',
    component: GameScoreVisualizer
  },
  {
    id: 'single-game-visualizer',
    name: 'Single Game Visualizer',
    description: 'Create a focused visualization for a specific game',
    component: SingleGameVisualizer
  }
];

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isConfigView, setIsConfigView] = useState(false);

  if (isConfigView) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 
              className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsConfigView(false)}
            >
              Configuration
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <LogoManager />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 
              className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setSelectedTool(null)}
            >
              Basketball Tools
            </h1>
            {selectedTool && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-accent-foreground">{selectedTool.name}</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsConfigView(true)}
            className="relative"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedTool ? (
          <selectedTool.component />
        ) : (
          <ToolSelector tools={tools} onSelectTool={setSelectedTool} />
        )}
      </main>
    </div>
  );
};

export default App;