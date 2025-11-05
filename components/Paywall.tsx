'use client';

import { getAppState, saveAppState } from '@/lib/storage';

interface PaywallProps {
  onComplete: () => void;
}

export default function Paywall({ onComplete }: PaywallProps) {
  const handlePay = () => {
    // In a real app, this would integrate with Stripe/PayPal
    const state = getAppState();
    state.hasPaid = true;
    saveAppState(state);
    onComplete();
  };

  const handleDecline = () => {
    // Reset streak and commitments
    const state = getAppState();
    state.currentStreak = 0;
    state.commitments = [];
    state.lastCommitmentDate = null;
    saveAppState(state);
    onComplete();
  };

  const state = getAppState();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-brown mb-8">
            Dein {state.currentStreak}-Tage-Streak ist beeindruckend.
          </h1>

          <p className="text-2xl text-brown leading-relaxed mb-8">
            Aber bist du bereit für ein echtes Bekenntnis?
          </p>

          <div className="border-4 border-brown p-8 bg-white mb-8">
            <p className="text-xl mb-6 leading-relaxed">
              Du kannst jetzt aufhören. War eine nette Woche.
            </p>
            <p className="text-2xl font-bold mb-6">
              Oder du kannst dein Leben flippen.
            </p>
          </div>

          <div className="text-left space-y-6 mb-8 bg-vintage/20 p-6 border-2 border-brown">
            <p className="text-lg italic">
              Es geht nicht um 1€ im Monat. Es geht darum, dass dieser 1€ dich schmerzt.
            </p>
            <p className="text-lg">
              Du gibst 10€ für Netflix, um die Träume <strong>anderer</strong> zu sehen.
              Du gibst 10€ für Spotify, um die Arbeit <strong>anderer</strong> zu hören.
            </p>
            <p className="text-xl font-bold">
              Investiere 0,99€ in DICH.
            </p>
            <p className="text-lg">
              Diese 99 Cent sind dein einmaliges, finanzielles Commitment. Es ist der Grund, warum du heute Abend nicht aufhörst.
            </p>
            <p className="text-2xl font-bold text-center mt-6">
              Das ist der Trick.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={handlePay}
              className="w-full bg-brown text-cream px-8 py-6 text-2xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg"
            >
              Ja, ich bekenne mich. (0,99€)
            </button>
            <button
              onClick={handleDecline}
              className="w-full bg-cream text-brown/50 px-8 py-3 text-sm border-2 border-brown/30 hover:bg-vintage/20 transition-colors"
            >
              Nein, ich war noch nicht so weit.
            </button>
            <p className="text-xs text-brown/50 text-center italic">
              (Achtung: "Nein" löscht deinen Streak auf 0)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
