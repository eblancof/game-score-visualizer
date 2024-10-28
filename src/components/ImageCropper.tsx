import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCrop, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = imageUrl;
        setImageLoaded(true);
      }
    };
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.1, scale + delta), 3);
    setScale(newScale);
  };

  const cropImage = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2 + position.x, -canvas.height / 2 + position.y);
    ctx.drawImage(imageRef.current, 0, 0);
    ctx.restore();

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = size;
    croppedCanvas.height = size;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;

    croppedCtx.drawImage(
      canvas,
      (canvas.width - size) / 2,
      (canvas.height - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );

    onCrop(croppedCanvas.toDataURL());
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-xl shadow-lg p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Crop Image</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-muted">
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="absolute inset-0 w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            className="hidden"
            onLoad={() => {
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext('2d');
              const img = imageRef.current;
              if (canvas && ctx && img) {
                ctx.drawImage(img, 0, 0);
              }
            }}
          />
          <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none" />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Scroll to zoom • Drag to move
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