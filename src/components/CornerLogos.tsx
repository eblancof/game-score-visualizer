import React from 'react';

interface CornerLogosProps {
  className?: string;
}

const CornerLogos: React.FC<CornerLogosProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-between items-center w-full ${className}`}>
      <div className="w-[15%] aspect-[2/1]">
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500" style={{ fontSize: 'min(1.2vw, 13px)' }}>
          Logo 1
        </div>
      </div>

      <div className="w-[15%] aspect-[2/1]">
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500" style={{ fontSize: 'min(1.2vw, 13px)' }}>
          Logo 2
        </div>
      </div>
    </div>
  );
};

export default CornerLogos;