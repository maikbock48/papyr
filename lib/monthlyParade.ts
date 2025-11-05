import { Commitment } from './storage';

export interface MonthlyParadeData {
  month: string;
  year: number;
  commitments: Commitment[];
  isAvailable: boolean;
}

export const getLastMonthCommitments = (commitments: Commitment[]): MonthlyParadeData => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const monthName = lastMonth.toLocaleString('de-DE', { month: 'long' });
  const year = lastMonth.getFullYear();

  const lastMonthCommitments = commitments.filter(c => {
    const commitDate = new Date(c.date);
    return commitDate.getMonth() === lastMonth.getMonth() &&
           commitDate.getFullYear() === lastMonth.getFullYear();
  });

  return {
    month: monthName,
    year,
    commitments: lastMonthCommitments,
    isAvailable: lastMonthCommitments.length > 0,
  };
};

export const generateParadeVideo = async (
  commitments: Commitment[],
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // HD Portrait für Stories
    canvas.width = 1080;
    canvas.height = 1920;

    const frameDuration = 100; // 100ms pro Bild = schneller Cut
    const frames: string[] = [];

    let currentFrame = 0;
    const totalFrames = commitments.length;

    const drawFrame = (index: number) => {
      if (index >= commitments.length) {
        resolve(frames[0]); // Return first frame as thumbnail
        return;
      }

      const commitment = commitments[index];

      // Cream background
      ctx.fillStyle = '#F9F9F0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw image
      const img = new Image();
      img.onload = () => {
        // Polaroid frame
        const frameSize = 900;
        const framePadding = 90;
        const frameX = (canvas.width - frameSize) / 2;
        const frameY = 300;

        // White polaroid background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(frameX - framePadding, frameY - framePadding,
                     frameSize + framePadding * 2, frameSize + framePadding * 2 + 150);

        // Brown border
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 12;
        ctx.strokeRect(frameX - framePadding, frameY - framePadding,
                       frameSize + framePadding * 2, frameSize + framePadding * 2 + 150);

        // Image
        ctx.drawImage(img, frameX, frameY, frameSize, frameSize);

        // Date text
        ctx.fillStyle = '#8B7355';
        ctx.font = 'bold 48px "Courier Prime", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(commitment.date, canvas.width / 2, frameY + frameSize + 100);

        // Counter
        ctx.font = 'bold 72px "Courier Prime", monospace';
        ctx.fillText(`${index + 1} / ${totalFrames}`, canvas.width / 2, 200);

        frames.push(canvas.toDataURL('image/jpeg', 0.85));

        if (onProgress) {
          onProgress((index + 1) / totalFrames);
        }

        currentFrame++;
        setTimeout(() => drawFrame(currentFrame), frameDuration);
      };

      img.src = commitment.imageData;
    };

    drawFrame(0);
  });
};

export const canShowParade = (commitments: Commitment[]): boolean => {
  const now = new Date();
  const dayOfMonth = now.getDate();

  // Show parade on days 1-7 of the month
  if (dayOfMonth > 7) return false;

  const paradeData = getLastMonthCommitments(commitments);
  return paradeData.isAvailable && paradeData.commitments.length >= 7;
};

export const hasSeenParade = (month: string, year: number): boolean => {
  if (typeof window === 'undefined') return false;
  const key = `parade_seen_${year}_${month}`;
  return localStorage.getItem(key) === 'true';
};

export const markParadeSeen = (month: string, year: number) => {
  if (typeof window === 'undefined') return;
  const key = `parade_seen_${year}_${month}`;
  localStorage.setItem(key, 'true');
};
