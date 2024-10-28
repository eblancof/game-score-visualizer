import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ToolSelector from './components/ToolSelector';
import GameScoreVisualizer from './tools/GameScoreVisualizer';
import SingleGameVisualizer from './tools/SingleGameVisualizer';
import LogoManager from './components/LogoManager';
import { ImagePlus } from 'lucide-react';
import { Button } from './components/ui/button';

export type Tool = {
  id: string;
  name: string;
  description: string;
  path: string;
  component: React.ComponentType;
};

const tools: Tool[] = [
  {
    id: 'game-score-visualizer',
    name: 'Game Score Visualizer',
    description: 'Create beautiful game score visualizations for social media',
    path: '/tools/game-score-visualizer',
    component: GameScoreVisualizer
  },
  {
    id: 'single-game-visualizer',
    name: 'Single Game Visualizer',
    description: 'Create a focused visualization for a specific game',
    path: '/tools/single-game-visualizer',
    component: SingleGameVisualizer
  }
];

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-semibold hover:text-primary transition-colors">
                Basketball Tools
              </Link>
              <Routes>
                {tools.map(tool => (
                  <Route
                    key={tool.id}
                    path={tool.path}
                    element={
                      <>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-accent-foreground">{tool.name}</span>
                      </>
                    }
                  />
                ))}
                <Route
                  path="/settings"
                  element={
                    <>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-accent-foreground">Logo Settings</span>
                    </>
                  }
                />
              </Routes>
            </div>
            <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <ImagePlus className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ToolSelector tools={tools} />} />
            {tools.map(tool => (
              <Route
                key={tool.id}
                path={tool.path}
                element={<tool.component />}
              />
            ))}
            <Route path="/settings" element={<LogoManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;