'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getLastMonthCommitments,
  markParadeSeen,
  type MonthlyParadeData,
} from '@/lib/monthlyParade';
import { Commitment } from '@/lib/storage';

interface MonthlyParadeProps {
  commitments: Commitment[];
  onClose: () => void;
}

export default function MonthlyParade({ commitments, onClose }: MonthlyParadeProps) {
  const [paradeData, setParadeData] = useState<MonthlyParadeData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const data = getLastMonthCommitments(commitments);
    setParadeData(data);
  }, [commitments]);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentIndex(0);

    // Play audio
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Cycle through images
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= (paradeData?.commitments.length || 0)) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setCurrentIndex(0);
        }, 500);
      } else {
        setCurrentIndex(index);
      }
    }, 100); // 100ms per image = fast cut

    return () => clearInterval(interval);
  };

  const handleShare = async () => {
    if (!paradeData) return;

    setIsGenerating(true);

    // Generate shareable image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = 1080;
    canvas.height = 1920;

    // Background
    ctx.fillStyle = '#F9F9F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#8B7355';
    ctx.font = 'bold 120px "Courier Prime", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('P A P Y R', canvas.width / 2, 200);

    // Month text
    ctx.font = 'bold 80px "Courier Prime", monospace';
    ctx.fillText(`Mein ${paradeData.month}.`, canvas.width / 2, 350);
    ctx.fillText('Durchgezogen.', canvas.width / 2, 470);

    // Count
    ctx.font = 'bold 180px "Courier Prime", monospace';
    ctx.fillText(`${paradeData.commitments.length}`, canvas.width / 2, 900);
    ctx.font = '60px "Courier Prime", monospace';
    ctx.fillText('Bekenntnisse', canvas.width / 2, 1000);

    // Grid of mini polaroids (3x3)
    const gridSize = 3;
    const polaroidSize = 250;
    const gap = 40;
    const startX = (canvas.width - (polaroidSize * gridSize + gap * (gridSize - 1))) / 2;
    const startY = 1150;

    for (let i = 0; i < Math.min(9, paradeData.commitments.length); i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const x = startX + col * (polaroidSize + gap);
      const y = startY + row * (polaroidSize + gap);

      // Polaroid frame
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x - 15, y - 15, polaroidSize + 30, polaroidSize + 50);
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = 6;
      ctx.strokeRect(x - 15, y - 15, polaroidSize + 30, polaroidSize + 50);

      // Image
      const img = new Image();
      img.src = paradeData.commitments[i].imageData;
      ctx.drawImage(img, x, y, polaroidSize, polaroidSize);
    }

    // Footer
    ctx.font = '48px "Courier Prime", monospace';
    ctx.fillStyle = '#8B7355';
    ctx.textAlign = 'center';
    ctx.fillText('Du brauchst es nicht?', canvas.width / 2, canvas.height - 150);
    ctx.fillText('Dann kriegst du es nicht.', canvas.width / 2, canvas.height - 80);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'papyr-parade.jpg', { type: 'image/jpeg' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: `Mein ${paradeData.month}. Durchgezogen.`,
            text: `${paradeData.commitments.length} Bekenntnisse. Jeden Abend. Ohne Ausnahme. #PAPYR`,
          });
        } else {
          // Fallback: download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'papyr-parade.jpg';
          a.click();
          URL.revokeObjectURL(url);
        }
      }
      setIsGenerating(false);
    }, 'image/jpeg', 0.9);
  };

  const handleClose = () => {
    if (paradeData) {
      markParadeSeen(paradeData.month, paradeData.year);
    }
    onClose();
  };

  if (!paradeData || !paradeData.isAvailable) {
    return null;
  }

  const currentCommitment = paradeData.commitments[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="max-w-4xl w-full h-full flex flex-col items-center justify-center p-6">
        {!isPlaying ? (
          // Preview screen
          <div className="text-center space-y-8">
            <h1 className="text-6xl font-bold text-cream tracking-wider">
              P A P Y R
            </h1>

            <div className="space-y-4">
              <p className="text-4xl text-cream font-bold">
                Dein {paradeData.month} {paradeData.year}
              </p>
              <p className="text-6xl text-cream font-bold">
                {paradeData.commitments.length}
              </p>
              <p className="text-2xl text-cream/80">
                Bekenntnisse. Durchgezogen.
              </p>
            </div>

            {/* Audio element (hidden) */}
            <audio
              ref={audioRef}
              src="/parade-music.mp3"
              preload="auto"
            />

            <div className="space-y-4 pt-8">
              <button
                onClick={handlePlay}
                className="bg-cream text-brown px-12 py-6 text-2xl font-bold hover:bg-cream/90 transition-colors border-4 border-cream shadow-xl"
              >
                ▶ Zeig mir meine Parade
              </button>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleShare}
                  disabled={isGenerating}
                  className="bg-brown/80 text-cream px-8 py-4 text-lg font-bold hover:bg-brown transition-colors border-2 border-cream disabled:opacity-50"
                >
                  {isGenerating ? '⏳ Generiere...' : '📤 Teilen'}
                </button>

                <button
                  onClick={handleClose}
                  className="bg-transparent text-cream/60 px-8 py-4 text-lg border-2 border-cream/40 hover:border-cream/60 transition-colors"
                >
                  Später
                </button>
              </div>
            </div>

            <p className="text-sm text-cream/50 italic pt-8">
              Die Parade verschwindet nach dem 7. des Monats.
            </p>
          </div>
        ) : (
          // Playing animation
          <div className="relative w-full max-w-2xl">
            <div className="border-[12px] border-cream bg-white p-8 shadow-2xl">
              {currentCommitment && (
                <>
                  <img
                    src={currentCommitment.imageData}
                    alt={`Bekenntnis ${currentIndex + 1}`}
                    className="w-full aspect-square object-cover mb-6"
                  />
                  <p className="text-2xl text-brown/70 font-bold text-center">
                    {currentCommitment.date}
                  </p>
                </>
              )}
            </div>

            <div className="absolute top-8 right-8 bg-brown/90 text-cream px-6 py-3 text-3xl font-bold border-4 border-cream">
              {currentIndex + 1} / {paradeData.commitments.length}
            </div>

            <div className="text-center mt-8">
              <p className="text-4xl text-cream font-bold">
                {paradeData.month} {paradeData.year}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
