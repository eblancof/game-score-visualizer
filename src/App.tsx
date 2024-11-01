import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import ToolSelector from './components/ToolSelector';
import GameScoreVisualizer from './tools/GameScoreVisualizer';
import SingleGameVisualizer from './tools/SingleGameVisualizer';
import LogoManager from './components/LogoManager';
import BackgroundManager from './components/BackgroundManager';
import FontManager from './components/font/FontManager';
import NotFound from './components/NotFound';
import { Tool } from './types/tool';

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

const App: React.FC = () => (
  <BrowserRouter>
    <Layout tools={tools}>
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
        <Route path="/backgrounds" element={<BackgroundManager />} />
        <Route path="/fonts" element={<FontManager />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;