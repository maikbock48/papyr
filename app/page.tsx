'use client';

import { useState, useEffect } from 'react';
import Onboarding from '@/components/Onboarding';
import MainApp from '@/components/MainApp';
import Paywall from '@/components/Paywall';
import { getAppState, completeOnboarding } from '@/lib/storage';

type AppView = 'onboarding' | 'main' | 'paywall';

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('onboarding');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = getAppState();
    if (state.hasCompletedOnboarding) {
      setCurrentView('main');
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (hasPaid: boolean) => {
    completeOnboarding(hasPaid);
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-4xl font-bold text-brown animate-pulse">
          P A P Y R
        </div>
      </div>
    );
  }

  switch (currentView) {
    case 'onboarding':
      return <Onboarding onComplete={handleOnboardingComplete} />;
    case 'paywall':
      return <Paywall onComplete={handlePaywallComplete} />;
    case 'main':
      return (
        <MainApp
          onPaywallRequired={handlePaywallRequired}
          onSevenDayReflection={handleSevenDayReflection}
        />
      );
    default:
      return null;
  }
}
