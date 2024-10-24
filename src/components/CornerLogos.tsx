import React from 'react';

interface CornerLogosProps {
  className?: string;
}

const CornerLogos: React.FC<CornerLogosProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-between items-center w-full ${className}`}>
      {/* Logo 1 */}
      <div className="w-24 h-12 sm:w-24 sm:h-12">
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs sm:text-sm text-gray-500">
          Logo 1
        </div>
      </div>

      {/* Logo 2 */}
      <div className="w-24 h-12 sm:w-24 sm:h-12">
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs sm:text-sm text-gray-500">
          Logo 2
        </div>
      </div>
    </div>
  );
};

export default CornerLogos;
