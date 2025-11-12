'use client';

import { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';

interface NewOnboardingProps {
  onComplete: (hasPaid: boolean, userName: string) => void;
  onOpenInspiration?: () => void;
}

export default function NewOnboarding({ onComplete, onOpenInspiration }: NewOnboardingProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [headlineComplete, setHeadlineComplete] = useState(false);

  const handleNext = () => {
    setCurrentSection(prev => prev + 1);
    setTypewriterKey(prev => prev + 1); // Reset typewriter for new section
    setHeadlineComplete(false); // Reset headline completion
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      handleNext();
    }
  };

  // Set headlineComplete to true if current section has no headline
  useEffect(() => {
    if (currentSection < sections.length) {
      const section = sections[currentSection];
      // If no headline OR if special is large_centered_text (which has its own headline handling)
      if (!section.headline) {
        setHeadlineComplete(true);
      }
    }
  }, [currentSection]);

  // Spielmacher Icon Component
  const SpielmacherIcon = () => (
    <div className="flex justify-center mb-8">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black flex items-center justify-center shadow-xl">
        <span className="text-4xl md:text-5xl">🎭</span>
      </div>
    </div>
  );

  const sections = [
    // Screen 1
    {
      headline: "LIEß DIR DAS NUR durch WENN DU ALLEINE BIST UND ZEIT HAST!!!",
      text: "- Albert Einstein :-)",
      buttonText: 'Weiter.'
    },
    // Screen 2
    {
      headline: "Willkommen Bro oder Sis!",
      text: "Das Einzige, was dich von Erfolg und dem Erreichen deiner Ziele fern hält, ist ein kleines simples Ritual vor dem Schlafen gehen.",
      buttonText: 'Weiter.'
    },
    // Screen 3
    {
      headline: "Wie beten. Aber: Nicht beten.",
      text: "Sondern Pläne schmieden.",
      special: "large_centered_text",
      buttonText: 'Weiter.'
    },
    // Screen 4
    {
      headline: "",
      text: "Und du hast den ganzen Tag, um dich darauf vorzubereiten.",
      buttonText: 'Hör jetzt ganze genau zu! - Weiter'
    },
    // Screen 5
    {
      headline: "",
      text: "Such dir einen Notizblock, du weißt, einen von denen, die hinten kleben. Schreibe dir jeden Abend vor dem Schlafen 1-2 Dinge auf, die du morgen erledigen willst. Und erledige sie auch. Das ist der ganze ganze Trick. Das ist Perspektive.",
      buttonText: 'Weiter.'
    },
    // Screen 6 - Name Input (special)
    {
      headline: "Wie heißt Du?",
      text: "",
      special: "name_input",
      buttonText: 'Weiter.',
      customAction: handleNameSubmit
    },
    // Screen 7
    {
      headline: `${userName || 'NAME'},`,
      text: "Du wirst alles erreichen können im Leben, wie ein verdammter Superman. Wenn du dir Pläne machst. Ab heute abend.",
      buttonText: 'Weiter.'
    },
    // Screen 8
    {
      headline: "",
      text: "Das können kleine Dinge sein. Morgen zum Friseur, morgen Bewerbung schreiben, ein Instrument anfangen. Das können aber auch große Dinge sein.\n\nWas willst du in deinem Leben erreichen, was vorher nur ein Traum war?",
      buttonText: 'Weiter.'
    },
    // Screen 9
    {
      headline: `${userName || 'NAME'}!`,
      text: "Also warum die App?\n\nDamit deine Träume greifbar werden. Ich bin PAPYR, die dümmste App der Welt, weil ich dich bitte, deine Pläne auf Papier zu schrieben. Handschriftlich. Jeden Tag. Und mit deinen Initialen jeden Tag zu signieren... wenn du willst.",
      buttonText: 'Weiter'
    },
    // Screen 10
    {
      headline: "",
      text: "((Du tauscht dir gerade 0,99€ct gegen dein Lebensglück ein!))\n\nDu gibst dir Ziele im Leben, nicht nur Träume. Du gibst Dir einen Weg. Du siehst jeden Tag als kostbaren Lebensabschnitt an.",
      buttonText: "Weiter..wir haben's gleich ;)"
    },
    // Screen 11
    {
      headline: "",
      text: "Durch Disziplin und Struktur im Leben: Durch 1-2 Sachen, die du dir einfach auf einen simplen Zettel notierst. Mehr ist das nicht. Kein Zaubertrick. Also warum ne App? Es wird dein Fotobuch sein auf dem Weg zu .. egal wohin Du willst. Das hier ist eine Bewegung und du wirst Teil davon sein. Wir brauchen keine Verkaufsmasche.",
      buttonText: `${userName || 'NAME'}.. Weiter`
    },
    // Screen 12
    {
      headline: "",
      text: "Du dokumentierst hier deinen Weg zum deinem Erfolg. Ich nehm dir nur den Euro für die Cloud ab. Das ist dein Aktenschrank. Damit du es dir beweisen kannst. Und es dokumentierst, um es der ganzen Welt zu beweisen!",
      buttonText: 'Weiter.'
    },
    // Screen 13
    {
      headline: "",
      text: "Das hier hat schon längst gestartet, wenn du bis hierhin ausgehalten hast! Also herzlichen Glückwunsch, dich trennt nur noch eine Woche vom Erfolg! Das ist alles. Keine Magie. Nur dein Commitment, digital verewigt: Dein Zettel, dein PAPYR. Ist das die dümmste Idee aller Zeiten? Oder ist sie so simpel, dass sie genial ist? Finde es heraus. Nachdem du eine Woche durchziehst, interessiert mich deine Meinung.",
      buttonText: 'Weiter.'
    },
  ];

  // Final screen is handled separately
  if (currentSection >= sections.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
        <div className="max-w-4xl mx-auto p-6 md:p-12 w-full">
          <div className="flex flex-col items-center justify-center space-y-12 text-center">
            <SpielmacherIcon />
            <h1 className="text-4xl md:text-6xl font-bold text-center" style={{ color: '#2d2e2e' }}>
              Schreibe deinen ersten<br />PAPYR
            </h1>

            {!showRules ? (
              <div className="space-y-6 w-full max-w-2xl">
                <button
                  onClick={() => onComplete(false, userName)}
                  className="w-full bg-black text-white px-12 py-6 text-2xl md:text-3xl font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-xl"
                >
                  Los geht's!
                </button>

                <button
                  onClick={() => setShowRules(true)}
                  className="w-full px-8 py-4 text-lg border-2 rounded-xl hover:bg-white/30 transition-colors shadow-md backdrop-blur-sm"
                  style={{ backgroundColor: 'transparent', borderColor: '#e0e0e0', color: '#2d2e2e' }}
                >
                  Die "Spielregeln" - dein Weg zu Erfolg
                </button>
              </div>
            ) : (
              <div className="space-y-8 w-full text-left max-w-2xl">
                <div className="border-2 rounded-xl shadow-lg p-8 bg-white" style={{ border: '0.5px solid black' }}>
                  <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#2d2e2e' }}>Die Spielregeln</h2>

                  <div className="space-y-6 text-lg" style={{ color: '#2d2e2e' }}>
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
                  className="w-full bg-black text-white px-12 py-6 text-2xl md:text-3xl font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-xl"
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
      className="min-h-screen flex items-center justify-center p-6 md:p-12"
      style={{ backgroundColor: 'rgb(206, 205, 203)' }}
    >
      <div className="max-w-3xl w-full">
        <div className="space-y-12">
          {/* Spielmacher Icon */}
          <SpielmacherIcon />

          {/* Headline - Always Centered with Typewriter Effect */}
          {currentScreenData.headline && (
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-center" style={{ color: '#2d2e2e' }}>
              <TypewriterText
                key={`headline-${typewriterKey}`}
                text={currentScreenData.headline}
                speed={30}
                onComplete={() => setHeadlineComplete(true)}
              />
            </h1>
          )}

          {/* Content - Only show after headline is complete (or if no headline) */}
          {(headlineComplete || !currentScreenData.headline) && (
            <>
              {currentScreenData.special === 'name_input' ? (
                <div className="space-y-8">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    placeholder="Dein Name..."
                    className="w-full border-2 p-6 text-2xl bg-white focus:outline-none focus:ring-2 focus:ring-black/50 text-center rounded-xl shadow-md"
                    style={{ borderColor: '#e0e0e0', color: '#2d2e2e' }}
                    autoFocus
                  />
                </div>
              ) : currentScreenData.special === 'large_centered_text' ? (
                <div className="text-3xl md:text-5xl font-bold leading-relaxed text-center" style={{ color: '#2d2e2e' }}>
                  <TypewriterText
                    key={`text-${typewriterKey}`}
                    text={currentScreenData.text}
                    speed={20}
                  />
                </div>
              ) : currentScreenData.text && (
                <div className="text-xl md:text-2xl leading-relaxed text-left" style={{ color: '#2d2e2e' }}>
                  <TypewriterText
                    key={`text-${typewriterKey}`}
                    text={currentScreenData.text}
                    speed={20}
                  />
                </div>
              )}
            </>
          )}

          {/* Button */}
          <div className="pt-8">
            <button
              onClick={currentScreenData.customAction || handleNext}
              disabled={currentScreenData.special === 'name_input' && !tempName.trim()}
              className="w-full bg-black text-white px-8 py-5 text-xl md:text-2xl font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentScreenData.buttonText}
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 pt-12">
            {sections.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSection
                    ? 'bg-black w-8'
                    : i < currentSection
                    ? 'bg-black/40'
                    : 'bg-black/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
