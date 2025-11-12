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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#2d2e2e' }}>Verarbeite Zahlung...</h1>
          <p style={{ color: '#2d2e2e' }}>Einen Moment bitte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2d2e2e' }}>
          Willkommen als Member!
        </h1>

        <div className="bg-white border-2 rounded-xl shadow-lg p-8 space-y-4" style={{ borderColor: '#2d2e2e' }}>
          <p className="text-xl font-bold" style={{ color: '#2d2e2e' }}>
            Deine Zahlung war erfolgreich!
          </p>
          <p className="text-lg" style={{ color: '#2d2e2e' }}>
            Du hast den wichtigsten Schritt gemacht – du hast dich zu dir selbst bekannt.
          </p>
          <p className="text-lg font-bold" style={{ color: '#2d2e2e' }}>
            Diese 0,99€ sind dein finanzielles Commitment zu deinem Wachstum.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-lg font-medium" style={{ color: '#2d2e2e' }}>
            ✅ Unbegrenzte Zettel-Uploads
          </p>
          <p className="text-lg font-medium" style={{ color: '#2d2e2e' }}>
            ✅ Voller Zugriff auf dein Archiv
          </p>
          <p className="text-lg font-medium" style={{ color: '#2d2e2e' }}>
            ✅ Streak-Tracking mit Joker-System
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="bg-black text-white px-8 py-4 text-xl font-bold hover:bg-gray-900 transition-all hover:scale-105 rounded-xl shadow-xl"
        >
          Weiter zur App
        </button>

        <p className="text-sm italic" style={{ color: '#666' }}>
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
