'use client';

export default function Rules() {
  return (
    <div className="min-h-screen py-12 px-4" >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#2d2e2e' }}>
          Spielregeln
        </h1>

        <div className="space-y-6">
          {/* Rule 1 */}
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                  Dein Zettel
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: '#666' }}>
                  Lässt sich täglich nur von <strong>20:00 - 02:00 Uhr</strong> hochladen. Wenn du es vergisst, kannst du deinen Tageserfolg nicht dokumentieren.
                </p>
                <p className="text-base mt-3 font-medium" style={{ color: '#2d2e2e' }}>
                  Das ist das Spiel, das ist Disziplin.
                </p>
              </div>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                  Der Streak
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: '#666' }}>
                  Wir zählen die Tage, die du durchhältst. Verpasst du das Zeitfenster, fällst du auf 0.
                </p>
                <p className="text-lg leading-relaxed mt-3" style={{ color: '#666' }}>
                  Das ist nur eine Zahl. <strong>Scheiß drauf!</strong> Von vorne anfangen heißt weitermachen!
                </p>
                <p className="text-base mt-3 font-medium" style={{ color: '#2d2e2e' }}>
                  Das ist das Spiel, das ist Disziplin.
                </p>
              </div>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                  Die Joker
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: '#666' }}>
                  Für jeden <strong>7-Tage-Streak</strong> erhältst du automatisch einen Joker. 🃏
                </p>
                <p className="text-lg leading-relaxed mt-3" style={{ color: '#666' }}>
                  Wenn du einen Tag verpasst, wird automatisch ein Joker eingesetzt, um deinen Streak zu retten. Hast du keinen Joker mehr, beginnt dein Streak von vorne.
                </p>
                <p className="text-base mt-3 font-medium" style={{ color: '#2d2e2e' }}>
                  Verdiene dir Joker durch Disziplin.
                </p>
              </div>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                  Der Aktenschrank
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: '#666' }}>
                  Wir speichern deine letzten <strong>14 Zettel kostenlos</strong>.
                </p>
                <p className="text-lg leading-relaxed mt-3" style={{ color: '#666' }}>
                  Für <strong>0,99€ im Monat</strong> wird daraus das ewige Archiv deines Erfolgs. Alle deine Zettel, für immer gespeichert.
                </p>
                <p className="text-base mt-3 font-medium" style={{ color: '#2d2e2e' }}>
                  Dein digitaler Aktenschrank für deine Erfolge.
                </p>
              </div>
            </div>
          </div>

          {/* The Philosophy */}
          <div className="bg-black text-white border-2 rounded-xl p-6 md:p-8 shadow-lg" style={{ borderColor: '#2d2e2e' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Die Philosophie
            </h2>
            <p className="text-lg leading-relaxed text-center mb-4">
              "Disziplin ist die Brücke zwischen Zielen und Erfolg."
            </p>
            <p className="text-base leading-relaxed text-white/80 text-center">
              PAPYR ist kein Produktivitäts-Tool. Es ist ein Ritual. Ein tägliches Versprechen an dich selbst, dass du deine Ziele ernst nimmst. Schreibe sie auf. Mit der Hand. Auf Papier. Jeden Abend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
