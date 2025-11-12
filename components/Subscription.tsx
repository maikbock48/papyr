'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/supabase/context';

export default function Subscription() {
  const { profile, loading } = useAuth();
  const [processingMember, setProcessingMember] = useState(false);
  const [processingPro, setProcessingPro] = useState(false);

  const currentStreak = profile?.current_streak || 0;
  const hasPaid = profile?.has_paid || false;
  const isPro = profile?.is_pro || false;
  const canUpgradeToPro = currentStreak >= 30;

  const handleCheckout = async (priceId: string, isPro: boolean) => {
    if (isPro) {
      setProcessingPro(true);
    } else {
      setProcessingMember(true);
    }

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Fehler beim Starten des Checkouts. Bitte versuche es erneut.');
    } finally {
      setProcessingMember(false);
      setProcessingPro(false);
    }
  };

  const handleBecomeMember = () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;
    handleCheckout(priceId, false);
  };

  const handleBecomePro = () => {
    if (!canUpgradeToPro) {
      alert(`🔥 Du brauchst einen Streak von mindestens 30 Tagen!\n\nDein aktueller Streak: ${currentStreak} Tage\n\nPro ist nur für die Diszipliniertesten unter uns. Bleib dran!`);
      return;
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!;
    handleCheckout(priceId, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <p className="text-lg" style={{ color: '#666' }}>Lädt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2d2e2e' }}>
            Wähle dein Level
          </h1>
          <p className="text-lg md:text-xl" style={{ color: '#666' }}>
            Unterstütze PAPYR und schalte Premium-Funktionen frei
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Member Plan */}
          <div className="bg-white border-2 rounded-xl overflow-hidden shadow-xl" style={{ borderColor: '#e0e0e0' }}>
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-6 py-8 text-center">
              <div className="text-5xl mb-4">📁</div>
              <h2 className="text-3xl font-bold mb-2">Member</h2>
              <div className="text-4xl font-bold mb-2">
                0,99€
              </div>
              <div className="text-sm opacity-80">pro Monat</div>
            </div>

            {/* Content */}
            <div className="p-8" >
              <p className="text-center mb-6 text-lg" style={{ color: '#2d2e2e' }}>
                Dein digitaler Aktenschrank
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Unbegrenzte Archivierung</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Alle deine Zettel werden dauerhaft gespeichert
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Cloud-Speicher</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Zugriff von überall, immer sicher
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Erfolgs-Archiv</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Dokumentiere deinen kompletten Weg
                    </div>
                  </div>
                </div>
              </div>

              {!hasPaid ? (
                <button
                  onClick={handleBecomeMember}
                  disabled={processingMember}
                  className="w-full bg-gray-900 text-white px-6 py-4 text-xl font-bold hover:bg-gray-800 transition-colors rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingMember ? 'Lädt...' : 'Member werden'}
                </button>
              ) : (
                <div className="text-center py-4 px-6 bg-green-100 rounded-xl border-2 border-green-500">
                  <div className="text-lg font-bold" style={{ color: '#2d2e2e' }}>✓ Aktiv</div>
                </div>
              )}

              <p className="text-xs text-center mt-4" style={{ color: '#999' }}>
                Kostenlos testen: Die ersten 14 Zettel sind gratis
              </p>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white border-2 rounded-xl overflow-hidden shadow-xl relative" style={{ borderColor: '#d4af37' }}>
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg z-10">
              BELIEBT
            </div>

            {/* Header */}
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white px-6 py-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-3xl font-bold mb-2">Pro</h2>
              <div className="text-4xl font-bold mb-2">
                4,99€
              </div>
              <div className="text-sm opacity-80">pro Monat</div>
            </div>

            {/* Content */}
            <div className="p-8" >
              <p className="text-center mb-6 text-lg font-bold" style={{ color: '#2d2e2e' }}>
                Alles von Member, plus:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🃏</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Extra-Joker jeden Monat</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Zusätzlicher Schutz für deinen Streak
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🛒</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>20% Rabatt dauerhaft</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Auf unseren Merch-Shop
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🧘</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Schalte Rituale frei</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Exklusive Routinen für deinen Erfolg
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">✨</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>"Pro" Badge hinter deinem Namen</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Das ist Bekenntnis.
                    </div>
                  </div>
                </div>
              </div>

              {!isPro ? (
                <>
                  <button
                    onClick={handleBecomePro}
                    disabled={processingPro || !canUpgradeToPro}
                    className={`w-full px-6 py-4 text-xl font-bold transition-colors rounded-xl shadow-lg ${
                      canUpgradeToPro
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {processingPro ? 'Lädt...' : '✨ Pro Member werden'}
                  </button>

                  {!canUpgradeToPro && (
                    <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-xl">
                      <p className="text-sm font-bold text-center" style={{ color: '#2d2e2e' }}>
                        🔥 Erst ab 30 Tage Streak verfügbar!
                      </p>
                      <p className="text-xs text-center mt-2" style={{ color: '#666' }}>
                        Dein aktueller Streak: {currentStreak} Tage
                      </p>
                      <p className="text-xs text-center mt-1" style={{ color: '#666' }}>
                        Noch {30 - currentStreak} Tage bis Pro! 💪
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 px-6 bg-yellow-100 rounded-xl border-2 border-yellow-500">
                  <div className="text-lg font-bold" style={{ color: '#2d2e2e' }}>✨ Pro Aktiv</div>
                </div>
              )}

              <p className="text-xs text-center mt-4" style={{ color: '#999' }}>
                {canUpgradeToPro ? 'Du hast dir das verdient! 🔥' : 'Nur für die Diszipliniertesten'}
              </p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: '#666' }}>
            Du hast bereits alles, was du brauchst: Zettel, Stift, Disziplin.<br />
            Die Mitgliedschaft ist ein Bekenntnis zu deinem Weg.
          </p>
        </div>

        {/* Pro Requirement Note */}
        {!canUpgradeToPro && (
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl">
            <p className="text-center text-lg font-bold mb-2" style={{ color: '#2d2e2e' }}>
              🔥 Pro ist nur für die Elite
            </p>
            <p className="text-center" style={{ color: '#666' }}>
              Zeige 30 Tage Disziplin und schalte das Pro-Level frei.<br />
              Aktueller Streak: <strong>{currentStreak} Tage</strong> | Noch <strong>{30 - currentStreak} Tage</strong> bis Pro!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
