'use client';

import { useState, useEffect } from 'react';
import NewOnboarding from '@/components/NewOnboarding';
import MainApp from '@/components/MainApp';
import Paywall from '@/components/Paywall';
import InspirationBrowser from '@/components/InspirationBrowser';
import { getAppState, completeOnboarding } from '@/lib/storage';

type AppView = 'onboarding' | 'main' | 'paywall';

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('onboarding');
  const [isLoading, setIsLoading] = useState(true);
  const [showInspirationBrowser, setShowInspirationBrowser] = useState(false);

  useEffect(() => {
    const state = getAppState();
    if (state.hasCompletedOnboarding) {
      setCurrentView('main');
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (hasPaid: boolean, userName: string) => {
    completeOnboarding(hasPaid, userName);
    setCurrentView('main');
  };

  const handlePaywallRequired = () => {
    setCurrentView('paywall');
  };

  const handlePaywallComplete = () => {
    setCurrentView('main');
  };

  const handleSevenDayReflection = () => {
    // After 7-day reflection, user stays in main app (they already paid)
    setCurrentView('main');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <img
          src="/assets/PAPYR.jpg"
          alt="PAPYR"
          className="max-w-md w-full h-auto animate-pulse"
        />
      </div>
    );
  }

  return (
    <>
      {currentView === 'onboarding' && (
        <NewOnboarding
          onComplete={handleOnboardingComplete}
          onOpenInspiration={() => setShowInspirationBrowser(true)}
        />
      )}
      {currentView === 'paywall' && (
        <Paywall onComplete={handlePaywallComplete} />
      )}
      {currentView === 'main' && (
        <MainApp
          onPaywallRequired={handlePaywallRequired}
          onSevenDayReflection={handleSevenDayReflection}
        />
      )}

      {/* Inspiration Browser (Global) */}
      <InspirationBrowser
        isOpen={showInspirationBrowser}
        onClose={() => setShowInspirationBrowser(false)}
      />
    </>
  );
}
