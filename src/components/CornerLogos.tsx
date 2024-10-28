import React from 'react';
import { Logo } from '../hooks/useLogos';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';

interface CornerLogosProps {
  className?: string;
  logos: Logo[];
  section: 'top' | 'bottom';
  onPositionUpdate?: (id: string, x: number, y: number) => void;
  isEditing?: boolean;
  onLogoSelect?: (id: string) => void;
  selectedLogo?: string | null;
  containerWidth?: number;
}

const CornerLogos: React.FC<CornerLogosProps> = ({
  className = '',
  logos,
  section,
  onPositionUpdate,
  isEditing = false,
  onLogoSelect,
  selectedLogo,
  containerWidth = 1080
}) => {
  const sectionLogos = logos.filter(logo => logo.section === section);
  const scaleFactor = containerWidth / 1080;

  return (
    <div className={`relative w-full ${className}`}>
      {sectionLogos.map((logo) => (
        <DraggableLogo
          key={logo.id}
          logo={logo}
          onPositionUpdate={onPositionUpdate}
          isEditing={isEditing}
          onLogoSelect={onLogoSelect}
          isSelected={selectedLogo === logo.id}
          scaleFactor={scaleFactor}
        />
      ))}
    </div>
  );
};

interface DraggableLogoProps {
  logo: Logo;
  onPositionUpdate?: (id: string, x: number, y: number) => void;
  isEditing: boolean;
  onLogoSelect?: (id: string) => void;
  isSelected: boolean;
  scaleFactor: number;
}

const DraggableLogo: React.FC<DraggableLogoProps> = ({ 
  logo, 
  onPositionUpdate, 
  isEditing,
  onLogoSelect,
  isSelected,
  scaleFactor
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

  const bind = useDrag(({ offset: [ox, oy], first, last }) => {
    if (!isEditing) return;
    
    api.start({ x: ox, y: oy, immediate: first });
    
    if (last && onPositionUpdate) {
      onPositionUpdate(logo.id, ox / scaleFactor, oy / scaleFactor);
    }
  }, {
    from: () => [x.get(), y.get()],
    bounds: { 
      left: -540 * scaleFactor, 
      right: 540 * scaleFactor, 
      top: -540 * scaleFactor, 
      bottom: 540 * scaleFactor 
    },
    enabled: isEditing
  });

  const handleClick = () => {
    if (!isEditing && onLogoSelect) {
      onLogoSelect(logo.id);
    }
  };

  return (
    <animated.div
      {...(isEditing ? bind() : {})}
      onClick={handleClick}
      style={{
        x,
        y,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: isEditing ? 'grab' : 'pointer',
        touchAction: 'none',
        outline: isSelected ? '2px solid hsl(var(--primary))' : 'none',
        borderRadius: '0.5rem'
      }}
      className="w-[15%] aspect-square"
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