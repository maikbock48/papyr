'use client';

import { useState, useEffect } from 'react';
import {
  getAppState,
  addCommitment,
  markCommitmentDeveloped,
  isWithinWolfHour,
  needsSevenDayReflection,
  completeSevenDayReflection,
} from '@/lib/storage';
import { shouldShowDailyQuestion } from '@/lib/dailyQuestions';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Archive from './Archive';
import Settings from './Settings';
import UploadFlow from './UploadFlow';
import DailyQuestion from './DailyQuestion';
import SevenDayReflection from './SevenDayReflection';

interface MainAppProps {
  onPaywallRequired: () => void;
  onSevenDayReflection: () => void;
}

type AppView = 'dashboard' | 'archive' | 'settings';

export default function MainApp({ onPaywallRequired, onSevenDayReflection }: MainAppProps) {
  const [appState, setAppState] = useState(getAppState());
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [showStreakSplash, setShowStreakSplash] = useState(true);
  const [showDailyQuestion, setShowDailyQuestion] = useState(false);
  const [showSevenDayReflection, setShowSevenDayReflection] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [globalPulse, setGlobalPulse] = useState(0);

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

  const handleUploadStart = () => {
    // This will be triggered from Dashboard when file is selected
    // For now, we'll use a simple file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentImage(reader.result as string);
          setIsUploading(true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleUploadSubmit = (goals: string, signWithInitials: boolean) => {
    if (!currentImage) return;

    const result = addCommitment(currentImage, goals, signWithInitials);
    const newState = getAppState();
    setAppState(newState);
    setIsUploading(false);
    setCurrentImage(null);

    // Increment global pulse
    setGlobalPulse(prev => prev + 1);

    // Show feedback if Joker was used
    if (result.jokersUsed > 0) {
      alert('🃏 Ein Joker wurde verwendet! Dein Streak bleibt bestehen.');
    }

    // Check if we should show daily question
    if (shouldShowDailyQuestion(newState.currentStreak)) {
      setShowDailyQuestion(true);
    }
  };

  const handleUploadCancel = () => {
    setIsUploading(false);
    setCurrentImage(null);
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

  if (isUploading && currentImage) {
    return (
      <UploadFlow
        imageData={currentImage}
        onSubmit={handleUploadSubmit}
        onCancel={handleUploadCancel}
      />
    );
  }

  return (
    <>
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      {currentView === 'dashboard' && (
        <Dashboard
          onUpload={handleUploadStart}
          onPaywallRequired={onPaywallRequired}
          globalPulse={globalPulse}
        />
      )}

      {currentView === 'archive' && <Archive />}

      {currentView === 'settings' && <Settings />}
    </>
  );
}
