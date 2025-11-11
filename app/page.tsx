'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/context';
import NewOnboarding from '@/components/NewOnboarding';
import MainApp from '@/components/MainApp';
import Paywall from '@/components/Paywall';
import InspirationBrowser from '@/components/InspirationBrowser';
import AuthModal from '@/components/AuthModal';
import { completeOnboarding } from '@/lib/supabase/database';

type AppView = 'onboarding' | 'main' | 'paywall' | 'auth';

export default function Home() {
  const { user, profile, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [showInspirationBrowser, setShowInspirationBrowser] = useState(false);

  useEffect(() => {
    console.log('[Page] Auth state changed:', {
      authLoading,
      hasUser: !!user,
      hasProfile: !!profile,
      profileOnboarding: profile?.has_completed_onboarding
    });

    if (authLoading) {
      console.log('[Page] Still loading auth...');
      return;
    }

    if (!user) {
      console.log('[Page] No user, showing auth modal');
      setCurrentView('auth');
    } else if (!profile) {
      console.log('[Page] User exists but no profile, showing auth modal');
      setCurrentView('auth');
    } else {
      if (profile.has_completed_onboarding) {
        console.log('[Page] User completed onboarding, showing main app');
        setCurrentView('main');
      } else {
        console.log('[Page] User needs onboarding');
        setCurrentView('onboarding');
      }
    }
  }, [user, profile, authLoading]);

  const handleOnboardingComplete = async (hasPaid: boolean, userName: string) => {
    try {
      console.log('[Page] Completing onboarding...');
      await completeOnboarding(hasPaid, userName);
      console.log('[Page] Onboarding completed, reloading...');
      window.location.reload();
    } catch (error) {
      console.error('[Page] Error completing onboarding:', error);
      alert('Fehler beim Abschließen des Onboardings. Bitte versuche es erneut.');
    }
  };

  const handlePaywallRequired = () => {
    setCurrentView('paywall');
  };

  const handlePaywallComplete = () => {
    setCurrentView('main');
  };

  const handleSevenDayReflection = () => {
    setCurrentView('main');
  };

  // Show loading screen while auth is loading
  if (authLoading) {
    console.log('[Page] Rendering loading screen');
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <img
          src="/assets/PAPYR.jpg"
          alt="PAPYR"
          className="max-w-md w-full h-auto animate-pulse"
        />
        <p className="text-white text-sm">Lädt...</p>
      </div>
    );
  }

  console.log('[Page] Rendering view:', currentView);

  return (
    <>
      {currentView === 'auth' && (
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          onSuccess={() => {
            console.log('[Page] Auth successful, reloading...');
            window.location.reload();
          }}
        />
      )}
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
