import React from 'react';

const HelloWorld: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white p-4 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Hello World!</h1>
        <p className="text-gray-600">This is a simple Hello World demo page.</p>
      </div>
    </div>
  );
};

export default HelloWorld;