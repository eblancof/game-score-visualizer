import React from 'react';
import type { Tool } from '../App';

interface ToolSelectorProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ tools, onSelectTool }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-white p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
          Social Network Basketball Tools
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-left hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
              <p className="text-gray-600">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolSelector;