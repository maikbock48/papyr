'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getAppState,
  addCommitment,
  markCommitmentDeveloped,
  isWithinWolfHour,
  canCommitToday,
  needsPaywall,
  needsSevenDayReflection,
  completeSevenDayReflection,
  type Commitment,
} from '@/lib/storage';
import { canShowParade, hasSeenParade, getLastMonthCommitments } from '@/lib/monthlyParade';
import { shouldShowDailyQuestion } from '@/lib/dailyQuestions';
import MonthlyParade from './MonthlyParade';
import DailyQuestion from './DailyQuestion';
import SevenDayReflection from './SevenDayReflection';

interface MainAppProps {
  onPaywallRequired: () => void;
  onSevenDayReflection: () => void;
}

export default function MainApp({ onPaywallRequired, onSevenDayReflection }: MainAppProps) {
  const [appState, setAppState] = useState(getAppState());
  const [showStreakSplash, setShowStreakSplash] = useState(true);
  const [showParade, setShowParade] = useState(false);
  const [showDailyQuestion, setShowDailyQuestion] = useState(false);
  const [showSevenDayReflection, setShowSevenDayReflection] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [goals, setGoals] = useState('');
  const [globalPulse, setGlobalPulse] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hide streak splash after 1.5 seconds, then check for what to show next
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStreakSplash(false);

      // Priority order:
      // 1. Seven Day Reflection (most important)
      if (needsSevenDayReflection()) {
        setShowSevenDayReflection(true);
        return;
      }

      // 2. Daily Question (if applicable)
      if (shouldShowDailyQuestion(appState.currentStreak)) {
        setShowDailyQuestion(true);
        return;
      }

      // 3. Monthly Parade
      if (canShowParade(appState.commitments)) {
        const paradeData = getLastMonthCommitments(appState.commitments);
        if (!hasSeenParade(paradeData.month, paradeData.year)) {
          setShowParade(true);
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [appState.currentStreak, appState.commitments]);

  // Simulate global pulse (in real app, this would be from a backend)
  useEffect(() => {
    if (isWithinWolfHour()) {
      // Simulate live counter
      const baseCount = 8342;
      const variance = Math.floor(Math.random() * 200);
      setGlobalPulse(baseCount + variance);

      const interval = setInterval(() => {
        setGlobalPulse(prev => prev + Math.floor(Math.random() * 3));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  // Polaroid development effect
  useEffect(() => {
    const developing = appState.commitments.filter(c => c.isDeveloping);
    if (developing.length > 0) {
      const timeout = setTimeout(() => {
        developing.forEach(c => markCommitmentDeveloped(c.id));
        setAppState(getAppState());
      }, 45000); // 45 seconds

      return () => clearTimeout(timeout);
    }
  }, [appState.commitments]);

  const handleCameraClick = () => {
    if (needsPaywall()) {
      onPaywallRequired();
      return;
    }

    if (!isWithinWolfHour()) {
      alert('⏰ Die Stunde des Wolfs ist zwischen 21:00 und 03:00 Uhr. Komm dann wieder.');
      return;
    }

    if (!canCommitToday()) {
      alert('✅ Du hast heute bereits dein Bekenntnis abgelegt. Bis morgen Abend!');
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentImage(reader.result as string);
      setIsUploading(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!currentImage || !goals.trim()) {
      alert('⚠️ Bitte scanne deinen Zettel UND tippe deine Ziele ab.');
      return;
    }

    if (goals.split('\n').filter(g => g.trim()).length > 2) {
      alert('⚠️ Maximal 2 Ziele. Fokussiere dich!');
      return;
    }

    addCommitment(currentImage, goals);
    const newState = getAppState();
    setAppState(newState);
    setIsUploading(false);
    setCurrentImage(null);
    setGoals('');

    // Increment global pulse
    setGlobalPulse(prev => prev + 1);

    // Check if we should show daily question
    if (shouldShowDailyQuestion(newState.currentStreak)) {
      setShowDailyQuestion(true);
    }
  };

  const handleCancel = () => {
    setIsUploading(false);
    setCurrentImage(null);
    setGoals('');
  };

  if (showStreakSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-9xl font-bold font-typewriter">
          {appState.currentStreak}
        </div>
      </div>
    );
  }

  if (showSevenDayReflection) {
    return (
      <SevenDayReflection
        onComplete={(vision) => {
          completeSevenDayReflection(vision, true);
          setAppState(getAppState());
          setShowSevenDayReflection(false);
          onSevenDayReflection();
        }}
      />
    );
  }

  if (showDailyQuestion) {
    return (
      <DailyQuestion
        day={appState.currentStreak}
        onComplete={() => {
          setShowDailyQuestion(false);
          setAppState(getAppState());
        }}
      />
    );
  }

  if (showParade) {
    return (
      <MonthlyParade
        commitments={appState.commitments}
        onClose={() => setShowParade(false)}
      />
    );
  }

  if (isUploading) {
    return (
      <div className="min-h-screen bg-cream p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-brown mb-8 text-center">
            Dein Bekenntnis
          </h2>

          {currentImage && (
            <div className="mb-8">
              <div className="border-8 border-brown bg-white p-4 shadow-2xl">
                <img
                  src={currentImage}
                  alt="Dein Zettel"
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-xl font-bold text-brown mb-4">
              Tippe deine 1-2 Ziele ab:
            </label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Ziel 1&#10;Ziel 2"
              rows={3}
              className="w-full border-4 border-brown p-4 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-brown/50"
            />
            <p className="text-sm text-brown/70 mt-2">
              Jede Zeile = ein Ziel. Maximal 2.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={!goals.trim()}
              className="w-full bg-brown text-cream px-8 py-4 text-xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg disabled:opacity-50"
            >
              Bekenntnis siegeln
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-cream text-brown px-8 py-3 text-lg border-2 border-brown hover:bg-vintage/30 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-brown tracking-wider mb-4">
            P A P Y R
          </h1>
          <div className="text-6xl font-bold text-brown mb-4">
            {appState.currentStreak}
          </div>
          <p className="text-lg text-brown/70">Tage des Bekenntnisses</p>

          {isWithinWolfHour() && (
            <p className="text-sm text-brown/60 mt-6 italic">
              In diesem Moment bekennen sich: <strong>{globalPulse.toLocaleString()}</strong> Seelen
            </p>
          )}

          {canShowParade(appState.commitments) && (
            <button
              onClick={() => setShowParade(true)}
              className="mt-6 bg-vintage/40 text-brown px-6 py-3 text-sm font-bold hover:bg-vintage/60 transition-colors border-2 border-brown"
            >
              🎬 Zeig mir meine {getLastMonthCommitments(appState.commitments).month}-Parade
            </button>
          )}
        </div>

        {/* Camera Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleCameraClick}
            className="bg-brown text-cream p-6 rounded-full hover:bg-brown/90 transition-all hover:scale-105 border-4 border-brown shadow-xl"
          >
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Archive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {appState.commitments.slice(0, appState.hasPaid ? undefined : 7).map((commitment) => (
            <div key={commitment.id} className="relative">
              <div className="border-8 border-brown bg-white p-3 shadow-xl">
                {commitment.isDeveloping ? (
                  <div className="aspect-square bg-white flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-brown/50 text-sm font-bold animate-pulse">
                        Entwickelt sich...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={commitment.imageData}
                      alt={`Bekenntnis ${commitment.date}`}
                      className="w-full aspect-square object-cover mb-2"
                    />
                    <div className="text-xs text-brown/70 space-y-1">
                      <p className="font-bold">{commitment.date}</p>
                      <p className="whitespace-pre-line">{commitment.goals}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {!appState.hasPaid && appState.commitments.length > 7 && (
            <div className="col-span-2 md:col-span-3 text-center border-4 border-brown/30 p-8 bg-vintage/20">
              <p className="text-lg text-brown/70 italic">
                Dein Archiv ist verblasst...<br />
                Bekenne dich für 0,99 €, um alles zu bewahren.
              </p>
            </div>
          )}
        </div>

        {appState.commitments.length === 0 && (
          <div className="text-center py-12 border-4 border-brown/30 bg-white/50">
            <p className="text-xl text-brown/70">
              Dein Archiv wartet auf dein erstes Bekenntnis.
            </p>
            <p className="text-sm text-brown/50 mt-4">
              Komm zwischen 21:00 und 03:00 Uhr zurück.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
