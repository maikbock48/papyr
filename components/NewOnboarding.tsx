'use client';

import { useState, useRef, useEffect } from 'react';

interface NewOnboardingProps {
  onComplete: (hasPaid: boolean, userName: string) => void;
}

export default function NewOnboarding({ onComplete }: NewOnboardingProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [showRules, setShowRules] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to section when currentSection changes
  useEffect(() => {
    const section = document.getElementById(`section-${currentSection}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentSection]);

  const handleNext = () => {
    setCurrentSection(prev => prev + 1);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      handleNext();
    }
  };

  const sections = [
    // Screen 1
    {
      content: (
        <div className="space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold text-brown leading-tight">
            LIEß DIR DAS NUR durch WENN DU ALLEINE BIST UND ZEIT HAST!!!
          </h1>
          <p className="text-xl text-brown/70">- Albert Einstein :-)</p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
    // Screen 2
    {
      content: (
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-brown">
            Willkommen Bro oder Sis!
          </h2>
          <p className="text-xl md:text-2xl text-brown leading-relaxed">
            Das einzige, was dich vom ,xxż**$\*** und dem Erreichen deiner Ziele fern hält, ist ein kleines simples Ritual vor dem Schlafen gehen.
          </p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
    // Screen 3
    {
      content: (
        <div className="space-y-6">
          <p className="text-2xl md:text-3xl text-brown font-bold">
            Wie beten. Aber: Nicht beten.
          </p>
          <p className="text-2xl md:text-3xl text-brown font-bold">
            Sondern Pläne schmieden.
          </p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
    // Screen 4
    {
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-brown leading-relaxed">
            Und du hast den ganzen Tag, um dich darauf vorzubereiten.
          </p>
        </div>
      ),
      buttonText: 'Hör jetzt ganze genau zu! - Weiter'
    },
    // Screen 5
    {
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-brown leading-relaxed">
            Such dir einen Notizblock, du weißt, einen von denen, die hinten kleben.
          </p>
          <p className="text-xl md:text-2xl text-brown leading-relaxed font-bold">
            Schreibe dir jeden Abend vor dem Schlafen 1-2 Dinge auf, die du morgen erledigen willst. Und erledige sie auch.
          </p>
          <p className="text-2xl md:text-3xl text-brown font-bold">
            Das ist der ganze ganze Trick.
          </p>
          <p className="text-2xl md:text-3xl text-brown font-bold">
            Das ist Perspektive.
          </p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
    // Screen 6 - Name Input
    {
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-brown">
            WIE HEISST DU???
          </h2>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            placeholder="Dein Name..."
            className="w-full border-4 border-brown p-6 text-2xl bg-white focus:outline-none focus:ring-4 focus:ring-brown/50 font-typewriter text-center"
            autoFocus
          />
        </div>
      ),
      buttonText: 'Weiter.',
      customAction: handleNameSubmit
    },
    // Screen 7
    {
      content: (
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-brown">
            {userName || 'NAME'},
          </h2>
          <p className="text-xl md:text-2xl text-brown leading-relaxed">
            Du wirst alles erreichen können im Leben, wie ein verdammter Superman.
          </p>
          <p className="text-xl md:text-2xl text-brown font-bold">
            Wenn du dir Pläne machst. Ab heute abend.
          </p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
    // Screen 8
    {
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-brown leading-relaxed">
            Das können kleine Dinge sein. Morgen zum Friseur, morgen Bewerbung schreiben, ein Instrument anfangen.
          </p>
          <p className="text-xl md:text-2xl text-brown leading-relaxed font-bold">
            Das können aber auch große Dinge sein.
          </p>
          <p className="text-xl md:text-2xl text-brown leading-relaxed font-bold">
            Was willst du in deinem Leben erreichen, was vorher nur ein Traum war?
          </p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
    // Screen 9
    {
      content: (
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-brown">
            {userName || 'NAME'}!
          </h2>
          <p className="text-xl md:text-2xl text-brown leading-relaxed">
            Also warum die App?
          </p>
          <p className="text-xl md:text-2xl text-brown font-bold">
            Damit deine Träume greifbar werden.
          </p>
          <p className="text-lg md:text-xl text-brown leading-relaxed">
            Ich bin PAPYR, die dümmste App der Welt, weil ich dich bitte, deine Pläne auf Papier zu schrieben. Handschriftlich. Jeden Tag. Und mit deinen Initialen jeden Tag zu signieren... wenn du willst.
          </p>
        </div>
      ),
      buttonText: 'Weiter'
    },
    // Screen 10
    {
      content: (
        <div className="space-y-6">
          <p className="text-sm md:text-base text-brown/60 italic">
            ((Du tauscht dir gerade 0,99€ct gegen dein Lebensglück ein!))
          </p>
          <p className="text-xl md:text-2xl text-brown leading-relaxed font-bold">
            Du gibst dir Ziele im Leben, nicht nur Träume. Du gibst Dir einen Weg. Du siehst jeden Tag als kostbaren Lebensabschnitt an.
          </p>
        </div>
      ),
      buttonText: "Weiter..wir haben's gleich ;)"
    },
    // Screen 11
    {
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-brown font-bold">
            Durch Disziplin und Struktur im Leben:
          </p>
          <p className="text-xl md:text-2xl text-brown font-bold">
            Durch 1-2 Sachen, die du dir einfach auf einen simplen Zettel notierst.
          </p>
          <p className="text-xl md:text-2xl text-brown">
            Mehr ist das nicht. Kein Zaubertrick.
          </p>
          <p className="text-lg md:text-xl text-brown leading-relaxed">
            Also warum ne App? Es wird dein Fotobuch sein auf dem Weg zu .. egal wohin Du willst.
          </p>
          <p className="text-xl md:text-2xl text-brown font-bold">
            Das hier ist eine Bewegung und du wirst Teil davon sein. Wir brauchen keine Verkaufsmasche.
          </p>
        </div>
      ),
      buttonText: `${userName || 'NAME'}.. Weiter`
    },
    // Screen 12
    {
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-brown leading-relaxed">
            Du dokumentierst hier deinen Weg zum deinem Erfolg. Ich nehm dir nur den Euro für die Cloud ab. Das ist dein Aktenschrank.
          </p>
          <p className="text-xl md:text-2xl text-brown font-bold">
            Damit du es dir beweisen kannst. Und es dokumentierst, um es der ganzen Welt zu beweisen!
          </p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
    // Screen 13
    {
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-brown leading-relaxed font-bold">
            Das hier hat schon längst gestartet, wenn du bis hierhin ausgehalten hast! Also herzlichen Glückwunsch, dich trennt nur noch eine Woche vom Erfolg!
          </p>
          <p className="text-lg md:text-xl text-brown leading-relaxed">
            Das ist alles. Keine Magie. Nur dein Commitment, digital verewigt: Dein Zettel, dein PAPYR.
          </p>
          <p className="text-xl md:text-2xl text-brown font-bold">
            Ist das die dümmste Idee aller Zeiten? Oder ist sie so simpel, dass sie genial ist?
          </p>
          <p className="text-lg md:text-xl text-brown">
            Finde es heraus. Nachdem du eine Woche durchziehst, interessiert mich deine Meinung.
          </p>
        </div>
      ),
      buttonText: 'Weiter.'
    },
  ];

  // Final screen is handled separately
  if (currentSection >= sections.length) {
    return (
      <div className="min-h-screen bg-cream overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-12">
          <div className="min-h-screen flex flex-col items-center justify-center space-y-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-brown">
              Schreibe deinen ersten<br />PAPYR
            </h1>

            {!showRules ? (
              <div className="space-y-6 w-full">
                <button
                  onClick={() => onComplete(false, userName)}
                  className="w-full bg-brown text-cream px-12 py-6 text-2xl md:text-3xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-xl"
                >
                  Los geht's!
                </button>

                <button
                  onClick={() => setShowRules(true)}
                  className="w-full bg-cream text-brown px-8 py-4 text-lg border-4 border-brown hover:bg-vintage/30 transition-colors"
                >
                  Die "Spielregeln" - dein Weg zu Erfolg
                </button>
              </div>
            ) : (
              <div className="space-y-8 w-full text-left">
                <div className="border-4 border-brown p-8 bg-white">
                  <h2 className="text-2xl font-bold text-brown mb-6">Die Spielregeln</h2>

                  <div className="space-y-6 text-lg text-brown">
                    <div>
                      <strong>Dein Zettel:</strong> Lässt sich täglich nur von 20:00 - 02:00 Uhr hochladen. Wenn du es vergisst, kannst du deinen Tageserfolg nicht dokumentieren. Das ist das Spiel, das ist Disziplin.
                    </div>

                    <div>
                      <strong>Der Streak:</strong> Wir zählen die Tage, die du durchhältst. Verpasst du das Fenster, fällst du auf 0. Das ist nur eine Zahl. Scheiß drauf! Von vorne anfangen heißt weitermachen! Das ist das Spiel, das ist Disziplin.
                    </div>

                    <div>
                      <strong>Der Aktenschrank:</strong> Wir speichern deine letzten 14 Zettel kostenlos. Für 1€ im Monat wird daraus das ewige Archiv deines Erfolgs.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onComplete(false, userName)}
                  className="w-full bg-brown text-cream px-12 py-6 text-2xl md:text-3xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-xl"
                >
                  Weiter zu PAPYR
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentScreenData = sections[currentSection];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-cream overflow-y-auto snap-y snap-mandatory"
      style={{ scrollBehavior: 'smooth' }}
    >
      {sections.map((section, index) => (
        <div
          key={index}
          id={`section-${index}`}
          className="min-h-screen flex items-center justify-center p-6 md:p-12 snap-start"
        >
          <div className="max-w-3xl w-full">
            <div className="space-y-12">
              {section.content}

              {index === currentSection && (
                <div className="pt-8">
                  <button
                    onClick={section.customAction || handleNext}
                    disabled={index === 5 && !tempName.trim()} // Name input validation
                    className="w-full bg-brown text-cream px-8 py-5 text-xl md:text-2xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {section.buttonText}
                  </button>
                </div>
              )}
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center gap-2 pt-12">
              {sections.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSection
                      ? 'bg-brown w-8'
                      : i < currentSection
                      ? 'bg-brown/40'
                      : 'bg-brown/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
