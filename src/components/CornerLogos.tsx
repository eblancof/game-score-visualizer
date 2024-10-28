import React from 'react';
import { Logo } from '../hooks/useLogos';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';

interface CornerLogosProps {
  className?: string;
  logos: Logo[];
  section: 'top' | 'bottom';
  onPositionUpdate?: (id: string, x: number, y: number) => void;
  selectedLogo?: string | null;
  onLogoSelect?: (id: string) => void;
  containerWidth?: number;
}

const CornerLogos: React.FC<CornerLogosProps> = ({
  className = '',
  logos,
  section,
  onPositionUpdate,
  selectedLogo,
  onLogoSelect,
  containerWidth = 1080
}) => {
  const sectionLogos = logos.filter(logo => logo.section === section);
  const scaleFactor = containerWidth / 1080;

  // Define section-specific constraints
  const yConstraints = section === 'top' 
    ? { min: -20 * scaleFactor, max: 60 * scaleFactor }
    : { min: -60 * scaleFactor, max: 20 * scaleFactor };

  return (
    <div className={`relative w-full ${className}`}>
      {sectionLogos.map((logo) => (
        <DraggableLogo
          key={logo.id}
          logo={logo}
          onPositionUpdate={onPositionUpdate}
          onLogoSelect={onLogoSelect}
          isSelected={selectedLogo === logo.id}
          scaleFactor={scaleFactor}
          yConstraints={yConstraints}
        />
      ))}
    </div>
  );
};

interface DraggableLogoProps {
  logo: Logo;
  onPositionUpdate?: (id: string, x: number, y: number) => void;
  onLogoSelect?: (id: string) => void;
  isSelected: boolean;
  scaleFactor: number;
  yConstraints: { min: number; max: number };
}

const DraggableLogo: React.FC<DraggableLogoProps> = ({ 
  logo, 
  onPositionUpdate,
  onLogoSelect,
  isSelected,
  scaleFactor,
  yConstraints
}) => {
  const [{ x, y }, api] = useSpring(() => ({
    x: (logo.position?.x || 0) * scaleFactor,
    y: (logo.position?.y || 0) * scaleFactor,
    config: { tension: 300, friction: 30 }
  }));

  React.useEffect(() => {
    api.start({
      x: (logo.position?.x || 0) * scaleFactor,
      y: (logo.position?.y || 0) * scaleFactor,
      immediate: true
    });
  }, [scaleFactor, logo.position, api]);

  const bind = useDrag(({ offset: [ox, oy], last }) => {
    const constrainedX = Math.max(-400 * scaleFactor, Math.min(400 * scaleFactor, ox));
    const constrainedY = Math.max(yConstraints.min, Math.min(yConstraints.max, oy));
    
    api.start({ 
      x: constrainedX, 
      y: constrainedY, 
      immediate: true 
    });
    
    if (last && onPositionUpdate) {
      onPositionUpdate(logo.id, constrainedX / scaleFactor, constrainedY / scaleFactor);
    }
  }, {
    from: () => [x.get(), y.get()],
    bounds: {
      left: -400 * scaleFactor,
      right: 400 * scaleFactor,
      top: yConstraints.min,
      bottom: yConstraints.max
    }
  });

  return (
    <animated.div
      {...bind()}
      onClick={() => onLogoSelect?.(logo.id)}
      style={{
        x,
        y,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'grab',
        touchAction: 'none',
        borderRadius: '0.5rem'
      }}
      className={`w-[15%] aspect-square ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-white' : ''}`}
    >
      {logo.url ? (
        <img
          src={logo.url}
          alt="Logo"
          className="w-full h-full object-contain"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
          Logo
        </div>
      )}
    </animated.div>
  );
};

export default CornerLogos;