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

  const handleBack = () => setSelectedTool(null);

  if (selectedTool) {
    const ToolComponent = selectedTool.component;
    return (
      <div>
        <button 
          onClick={handleBack}
          className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors z-50"
        >
          ← Back to Tools
        </button>
        <ToolComponent />
      </div>
    );
  }

  return <ToolSelector tools={tools} onSelectTool={setSelectedTool} />;
};

export default App;