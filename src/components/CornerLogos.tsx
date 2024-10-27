import React from 'react';
import { Logo } from '../hooks/useLogos';

interface CornerLogosProps {
  className?: string;
  logos: Logo[];
  position: 'top' | 'bottom';
}

const CornerLogos: React.FC<CornerLogosProps> = ({ className = '', logos, position }) => {
  const positionLogos = position === 'top' ? logos.slice(0, 2) : logos.slice(2, 4);

  return (
    <div className={`flex justify-between items-center w-full ${className}`}>
      {positionLogos.map((logo) => (
        <div key={logo.id} className="w-[15%] aspect-[2/1]">
          {logo.url ? (
            <img
              src={logo.url}
              alt={logo.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500" style={{ fontSize: 'min(1.2vw, 13px)' }}>
              {logo.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CornerLogos;