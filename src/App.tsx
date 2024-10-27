import React from 'react';
import { useState } from 'react';
import ToolSelector from './components/ToolSelector';
import GameScoreVisualizer from './tools/GameScoreVisualizer';
import SingleGameVisualizer from './tools/SingleGameVisualizer';

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-8">
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