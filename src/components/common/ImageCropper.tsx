import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  title?: string;
  aspectRatio?: 'square' | 'free';
  maxSize?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCrop,
  onCancel,
  title = 'Crop Image',
  aspectRatio = 'square',
  maxSize = 800
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Touch event handling
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = imageUrl;
        setImageLoaded(true);
        
        const canvas = canvasRef.current;
        if (canvas) {
          const centerX = (canvas.width - image.width * scale) / 2;
          const centerY = (canvas.height - image.height * scale) / 2;
          setPosition({ x: centerX, y: centerY });
        }
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = imageRef.current;

      if (canvas && ctx && img) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      }
    };

    drawCanvas();
  }, [position, scale, imageLoaded]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setStartPos({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y
        });
      }
    } else if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - startPos.x,
        y: touch.clientY - startPos.y
      });
    } else if (e.touches.length === 2) {
      const newDistance = getTouchDistance(e.touches);
      if (lastTouchDistance !== null) {
        const delta = newDistance - lastTouchDistance;
        const zoomSensitivity = 0.005;
        const newScale = Math.min(Math.max(0.1, scale * (1 + delta * zoomSensitivity)), 3);
        setScale(newScale);
      }
      setLastTouchDistance(newDistance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(null);
  };

  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.0005;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.1, scale * (1 + delta)), 3);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const scaleChange = newScale - scale;
      const newX = position.x - (mouseX - position.x) * (scaleChange / scale);
      const newY = position.y - (mouseY - position.y) * (scaleChange / scale);

      setPosition({ x: newX, y: newY });
      setScale(newScale);
    }
  };

  const cropImage = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const croppedCanvas = document.createElement('canvas');
    const size = aspectRatio === 'square' ? Math.min(canvas.width, canvas.height) : canvas.width;
    const height = aspectRatio === 'square' ? size : canvas.height;
    
    croppedCanvas.width = size;
    croppedCanvas.height = height;
    
    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, height);
    
    ctx.drawImage(canvas, 
      (canvas.width - size) / 2, 
      (canvas.height - height) / 2, 
      size, 
      height, 
      0, 
      0, 
      size, 
      height
    );

    onCrop(croppedCanvas.toDataURL());
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-xl shadow-lg p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div 
          className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-muted"
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            width={maxSize}
            height={maxSize}
            className="absolute inset-0 w-full h-full cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            className="hidden"
          />
          <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none" />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Scroll or pinch to zoom • Drag to move
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={cropImage} disabled={!imageLoaded}>
              <Check className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageCropper;