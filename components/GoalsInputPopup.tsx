'use client';

import { useState, useEffect, useRef } from 'react';

interface GoalsInputPopupProps {
  isOpen: boolean;
  imageUrl: string;
  onSubmit: (goals: string, initials: string, signedImageBlob?: Blob) => void;
  onClose: () => void;
}

export default function GoalsInputPopup({ isOpen, imageUrl, onSubmit, onClose }: GoalsInputPopupProps) {
  const [show, setShow] = useState(false);
  const [goals, setGoals] = useState('');
  const [initials, setInitials] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(3);

  // Load image into canvas when opened
  useEffect(() => {
    if (isOpen && imageUrl && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0);
      };

      if (img.complete) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0);
      }
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
      setGoals('');
      setInitials('');
      setHasSignature(false);
    }
  }, [isOpen]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasSignature(true);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (ctx && img && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHasSignature(false);
    }
  };

  const handleSubmit = async () => {
    if (goals.trim()) {
      let signedImageBlob: Blob | undefined;

      if (hasSignature && canvasRef.current) {
        // Convert canvas to blob
        signedImageBlob = await new Promise<Blob>((resolve) => {
          canvasRef.current!.toBlob((blob) => {
            resolve(blob!);
          }, 'image/jpeg', 0.95);
        });
      }

      onSubmit(goals.trim(), initials.trim(), signedImageBlob);
      handleClose();
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        show ? 'backdrop-blur-md' : ''
      }`}
      onClick={handleClose}
      style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.92)' : 'rgba(0, 0, 0, 0)' }}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] bg-white border-2 shadow-2xl rounded-2xl transform transition-all duration-300 overflow-hidden flex flex-col ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ borderColor: '#2d2e2e' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b-2 flex-shrink-0 relative" style={{ backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#2d2e2e' }}>
              Deine Ziele für morgen
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-6 hover:opacity-70 transition-opacity text-3xl font-bold"
            style={{ color: '#2d2e2e' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview with Drawing Canvas */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Signiere deinen Zettel
              </h3>
              <div className="bg-white border-2 rounded-xl p-4 shadow-lg" style={{ borderColor: '#2d2e2e' }}>
                <div className="relative w-full aspect-square">
                  {/* Hidden image for loading */}
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Hochgeladener Zettel"
                    className="hidden"
                  />
                  {/* Canvas for drawing */}
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full rounded-lg cursor-crosshair touch-none"
                    style={{ border: '2px solid #e0e0e0' }}
                  />
                </div>

                {/* Drawing Tools */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-bold" style={{ color: '#2d2e2e' }}>Farbe:</label>
                    <div className="flex gap-2">
                      {['#000000', '#FF0000', '#0000FF', '#10B981', '#FFFFFF'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setPenColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            penColor === color ? 'scale-110 ring-2 ring-black' : ''
                          }`}
                          style={{
                            backgroundColor: color,
                            borderColor: color === '#FFFFFF' ? '#2d2e2e' : color
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-bold" style={{ color: '#2d2e2e' }}>Größe:</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={penSize}
                      onChange={(e) => setPenSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold w-8" style={{ color: '#2d2e2e' }}>{penSize}</span>
                  </div>

                  <button
                    onClick={clearSignature}
                    className="w-full bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50 transition-all border-2 rounded-lg shadow-sm"
                    style={{ borderColor: '#2d2e2e', color: '#2d2e2e' }}
                  >
                    🗑️ Signatur löschen
                  </button>
                </div>
              </div>
            </div>

            {/* Goals Input */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Was willst du morgen erreichen?
              </h3>
              <div className="bg-white border-2 rounded-xl p-4 shadow-lg flex flex-col gap-4 h-full" style={{ borderColor: '#2d2e2e' }}>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Schreibe deine Ziele für morgen..."
                  className="flex-1 p-4 border-2 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-black/50"
                  style={{ borderColor: '#e0e0e0', color: '#2d2e2e', minHeight: '300px' }}
                  autoFocus
                />

                <p className="text-sm" style={{ color: '#666' }}>
                  💡 Tipp: Schreibe konkrete, erreichbare Ziele. Was willst du morgen wirklich schaffen?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t-2 flex-shrink-0" style={{ backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-white px-6 py-3 text-lg font-bold hover:bg-gray-50 transition-all hover:scale-105 border-2 rounded-xl shadow-md"
              style={{ borderColor: '#2d2e2e', color: '#2d2e2e' }}
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              disabled={!goals.trim()}
              className="flex-1 bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-all hover:scale-105 border-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ borderColor: '#2d2e2e' }}
            >
              Ziele speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
