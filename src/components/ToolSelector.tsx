import React from 'react';
import { Link } from 'react-router-dom';
import type { Tool } from '../App';

interface ToolSelectorProps {
  tools: Tool[];
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ tools }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-foreground">
        Social Network Basketball Tools
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="bg-card hover:bg-accent text-card-foreground rounded-xl p-6 text-left transition-all duration-200 shadow-md hover:shadow-lg border border-border/50 hover:border-primary/20"
          >
            <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
            <p className="text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolSelector;