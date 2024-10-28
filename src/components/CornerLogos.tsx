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
}

const CornerLogos: React.FC<CornerLogosProps> = ({
  className = '',
  logos,
  section,
  onPositionUpdate,
  isEditing = false
}) => {
  const sectionLogos = logos.filter(logo => logo.section === section);

  return (
    <div className={`relative w-full ${className}`}>
      {sectionLogos.map((logo) => (
        <DraggableLogo
          key={logo.id}
          logo={logo}
          onPositionUpdate={onPositionUpdate}
          isEditing={isEditing}
        />
      ))}
    </div>
  );
};

interface DraggableLogoProps {
  logo: Logo;
  onPositionUpdate?: (id: string, x: number, y: number) => void;
  isEditing: boolean;
}

const DraggableLogo: React.FC<DraggableLogoProps> = ({ logo, onPositionUpdate, isEditing }) => {
  const [{ x, y }, api] = useSpring(() => ({
    x: logo.position?.x || 0,
    y: logo.position?.y || 0,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(({ offset: [ox, oy], first, last }) => {
    if (!isEditing) return;
    
    api.start({ x: ox, y: oy, immediate: first });
    
    if (last && onPositionUpdate) {
      onPositionUpdate(logo.id, ox, oy);
    }
  }, {
    from: () => [x.get(), y.get()],
    bounds: { left: -50, right: 50, top: -20, bottom: 20 },
    enabled: isEditing
  });

  return (
    <animated.div
      {...(isEditing ? bind() : {})}
      style={{
        x,
        y,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: isEditing ? 'grab' : 'default',
        touchAction: 'none'
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