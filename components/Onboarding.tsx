'use client';

import { useState } from 'react';

interface OnboardingProps {
  onComplete: (hasPaid: boolean) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);

  const slides = [
    {
      title: 'P A P Y R',
      content: (
        <>
          <p className="text-xl mb-8 leading-relaxed">
            Wieder ein Tag vorbei. Wieder nur geträumt. Dein Handy ist voller Pläne, dein Leben nicht.
          </p>
          <p className="text-2xl font-bold">
            Das hier ist keine App. Es ist ein Ritual.
          </p>
        </>
      ),
      buttonText: 'Was für ein Ritual?',
    },
    {
      title: 'Der Analoge Schwur',
      content: (
        <>
          <p className="text-xl mb-8 leading-relaxed">
            Das Geheimnis ist nicht digital. Es ist auf Papier.
          </p>
          <div className="text-left space-y-4 mb-8 text-lg">
            <p>1. Nimm <strong>JEDEN ABEND</strong> einen Zettel.</p>
            <p>2. Schreibe <strong>1-2 FOKUSSIERTE</strong> Ziele für morgen.</p>
          </div>
          <p className="text-xl font-bold">
            Von Hand. Ohne Ausnahme. Das ist dein Schwur.
          </p>
        </>
      ),
      buttonText: 'Und wofür brauche ich dann DICH?',
    },
    {
      title: 'Der Quadratische Lerneffekt',
      content: (
        <>
          <p className="text-xl mb-6 leading-relaxed">
            Gute Frage. Du brauchst uns (fast) nicht.
          </p>
          <p className="text-lg mb-6 leading-relaxed">
            Wir sind nur der Beweis. Ein dummes, unnötiges Archiv. Aber mit einem Trick:
          </p>
          <p className="text-xl font-bold mb-8">
            Wir zwingen dich, deinen Schwur zu siegeln.
          </p>
          <p className="text-lg leading-relaxed">
            Du scannst den Zettel... und dann tippst du deine 1-2 Ziele Wort für Wort ab.
          </p>
          <p className="text-xl font-bold mt-8">
            Schreiben (Hand) + Siegeln (Digital) = Quadratischer Lerneffekt.
          </p>
          <p className="text-lg mt-4">
            Das ist die Verinnerlichung. Das ist der Trick.
          </p>
        </>
      ),
      buttonText: 'Okay, ich verstehe... was kostet der Trick?',
    },
    {
      title: 'Das Bekenntnis',
      content: (
        <>
          <p className="text-xl mb-6 leading-relaxed">
            Das Ritual ist kostenlos. Das ewige Archiv ist dein Bekenntnis.
          </p>
          <p className="text-lg mb-8 leading-relaxed">
            Du kannst 7 Tage kostenlos testen und sehen, wie dein Streak wächst.
          </p>
          <div className="border-4 border-brown p-6 mb-8">
            <p className="text-2xl font-bold mb-4">
              "Teil das Ritual einmal für 0,99 €."
            </p>
            <p className="text-xl">
              Dein Leben wird's dir danken. Und wir auch. Bekenne dich.
            </p>
          </div>
          <p className="text-lg leading-relaxed italic">
            Investiere 99 Cent in DICH, statt 10€ in die Träume anderer (Netflix).
          </p>
        </>
      ),
      buttonText: null,
    },
  ];

  const currentSlide = slides[step - 1];

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-brown mb-12">
            {currentSlide.title}
          </h1>

          <div className="text-center">
            {currentSlide.content}
          </div>

          <div className="pt-8 space-y-4">
            {currentSlide.buttonText ? (
              <button
                onClick={() => setStep(step + 1)}
                className="w-full bg-brown text-cream px-8 py-4 text-xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg"
              >
                {currentSlide.buttonText}
              </button>
            ) : (
              <>
                <button
                  onClick={() => onComplete(true)}
                  className="w-full bg-brown text-cream px-8 py-6 text-2xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg mb-4"
                >
                  Ich bekenne mich. (0,99 €)
                </button>
                <button
                  onClick={() => onComplete(false)}
                  className="w-full bg-cream text-brown px-8 py-4 text-lg border-2 border-brown hover:bg-vintage/30 transition-colors"
                >
                  Ich teste 7 Tage.
                </button>
              </>
            )}
          </div>

          {step < 4 && (
            <div className="flex justify-center gap-2 pt-4">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${
                    s === step ? 'bg-brown' : 'bg-brown/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
