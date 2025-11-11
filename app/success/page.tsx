'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/supabase/context';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Wait a bit for the webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refresh profile to get updated payment status
      await refreshProfile();
      setLoading(false);
    };

    if (sessionId) {
      checkPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [sessionId, refreshProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brown mb-4">Verarbeite Zahlung...</h1>
          <p className="text-brown">Einen Moment bitte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl md:text-5xl font-bold text-brown mb-6">
          Willkommen als Member!
        </h1>

        <div className="bg-white border-4 border-brown p-8 space-y-4">
          <p className="text-xl text-brown">
            Deine Zahlung war erfolgreich!
          </p>
          <p className="text-lg text-brown">
            Du hast den wichtigsten Schritt gemacht – du hast dich zu dir selbst bekannt.
          </p>
          <p className="text-lg text-brown font-bold">
            Diese 0,99€ sind dein finanzielles Commitment zu deinem Wachstum.
          </p>
        </div>

        <div className="space-y-3 text-brown">
          <p className="text-lg">
            ✅ Unbegrenzte Zettel-Uploads
          </p>
          <p className="text-lg">
            ✅ Voller Zugriff auf dein Archiv
          </p>
          <p className="text-lg">
            ✅ Streak-Tracking mit Joker-System
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="bg-brown text-cream px-8 py-4 text-xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg"
        >
          Weiter zur App
        </button>

        <p className="text-sm text-brown/70 italic">
          Session-ID: {sessionId?.substring(0, 20)}...
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brown mb-4">Lädt...</h1>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
