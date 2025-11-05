'use client';

import { useState } from 'react';
import { getAnswers } from '@/lib/dailyQuestions';

interface SevenDayReflectionProps {
  onComplete: (tenYearVision: string) => void;
}

export default function SevenDayReflection({ onComplete }: SevenDayReflectionProps) {
  const [vision, setVision] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const answers = getAnswers();

  if (currentStep === 1) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full space-y-12 text-center">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold text-cream tracking-wider">
              7 TAGE
            </h1>
            <p className="text-3xl text-cream/80">
              Ohne Ausnahme. Durchgezogen.
            </p>
          </div>

          <div className="border-4 border-cream p-8 space-y-6">
            <p className="text-2xl text-cream leading-relaxed">
              Du hast dir in den letzten 7 Tagen {answers.length} Fragen gestellt.
            </p>
            <p className="text-xl text-cream/70 italic">
              Jetzt ist der Moment, ehrlich zu sein.
            </p>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="bg-cream text-black px-12 py-6 text-2xl font-bold hover:bg-cream/90 transition-colors border-4 border-cream shadow-xl"
          >
            Ich bin bereit
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="fixed inset-0 bg-cream z-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full space-y-10">
          <div className="text-center space-y-6">
            <p className="text-brown/60 text-xl font-bold tracking-wider">
              DIE ENTSCHEIDENDE FRAGE
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-brown leading-tight">
              Wo willst du in 10 Jahren sein?
            </h1>
            <p className="text-xl text-brown/70 italic">
              Nicht träumen. Beschreiben.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="In 10 Jahren bin ich..."
              rows={8}
              className="w-full border-4 border-brown p-6 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-brown/50 font-typewriter resize-none"
              autoFocus
            />
            <p className="text-sm text-brown/60 italic">
              Nimm dir Zeit. Das ist dein Nordstern für die nächsten 3.650 Tage.
            </p>
          </div>

          <button
            onClick={() => {
              if (!vision.trim()) {
                alert('⚠️ Du kannst nicht weitergehen ohne zu wissen wohin.');
                return;
              }

              // Save vision
              if (typeof window !== 'undefined') {
                localStorage.setItem('papyr_ten_year_vision', vision);
              }

              setCurrentStep(3);
            }}
            disabled={!vision.trim()}
            className="w-full bg-brown text-cream px-8 py-5 text-xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg disabled:opacity-50"
          >
            Das ist mein Ziel
          </button>
        </div>
      </div>
    );
  }

  // Step 3: The Challenge
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-cream leading-tight">
            Jetzt die Frage, die zählt:
          </h1>

          <div className="border-4 border-cream p-10 space-y-8">
            <p className="text-3xl md:text-4xl text-cream font-bold leading-relaxed">
              Warum zahlst du nicht einfach den 1€ und legst los?
            </p>

            <div className="text-left space-y-6 text-cream/80 text-lg border-t-2 border-cream/30 pt-8">
              <p>
                Du weißt jetzt, wo du in 10 Jahren sein willst.
              </p>
              <p>
                Du hast 7 Tage durchgezogen. Jeden Abend. Ohne Ausnahme.
              </p>
              <p className="text-xl text-cream font-bold">
                Das hier funktioniert. Du weißt es. Du spürst es.
              </p>
              <p className="text-2xl text-cream font-bold pt-4">
                Also: Warum nicht?
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <p className="text-xl text-cream/60 italic">
              3 Cent am Tag. Für dein 10-Jahres-Ziel.<br />
              Das ist keine Investition. Das ist ein Witz.
            </p>
            <p className="text-2xl text-cream font-bold">
              Außer... du meinst es nicht ernst?
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onComplete(vision)}
            className="w-full bg-cream text-black px-8 py-6 text-2xl font-bold hover:bg-cream/90 transition-colors border-4 border-cream shadow-xl"
          >
            Ich meine es ernst. (0,99€)
          </button>

          <button
            onClick={() => {
              // Reset streak and start over
              if (typeof window !== 'undefined') {
                const state = JSON.parse(localStorage.getItem('papyr_state') || '{}');
                state.currentStreak = 0;
                state.commitments = [];
                state.lastCommitmentDate = null;
                localStorage.setItem('papyr_state', JSON.stringify(state));
              }
              window.location.reload();
            }}
            className="w-full bg-transparent text-cream/40 px-8 py-3 text-sm border-2 border-cream/20 hover:border-cream/40 transition-colors"
          >
            Ich meinte es nicht ernst. (Streak zurücksetzen)
          </button>
        </div>
      </div>
    </div>
  );
}
