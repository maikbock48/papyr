'use client';

import { useState } from 'react';
import { getAppState, saveAppState } from '@/lib/storage';
import ConfirmDialog from './ConfirmDialog';

export default function Subscription() {
  const [appState, setAppState] = useState(getAppState());
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);

  const handleBecomeMember = () => {
    setShowMemberDialog(true);
  };

  const confirmBecomeMember = () => {
    const state = getAppState();
    state.hasPaid = true;
    saveAppState(state);
    setAppState(state);
    alert('🎉 Willkommen als Member! Deine Zettel werden jetzt unbegrenzt gespeichert.');
    setShowMemberDialog(false);
  };

  const handleBecomePro = () => {
    setShowProDialog(true);
  };

  const confirmBecomePro = () => {
    const state = getAppState();
    state.isPro = true;
    state.hasPaid = true;
    saveAppState(state);
    setAppState(state);
    alert('🎉 Willkommen als Pro Member! Du erhältst jetzt alle Pro-Vorteile.');
    setShowProDialog(false);
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
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
            <div className="p-8" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
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

              {!appState.hasPaid ? (
                <button
                  onClick={handleBecomeMember}
                  className="w-full bg-gray-900 text-white px-6 py-4 text-xl font-bold hover:bg-gray-800 transition-colors rounded-xl shadow-lg"
                >
                  Member werden
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
            <div className="p-8" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
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
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>20% Rabatt im Shop</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Dauerhaft auf alle Produkte
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Teile deine Meilensteine</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Inspiriere die Community
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">💚</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Unterstütze soziale Projekte</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Jede Mitgliedschaft hilft anderen
                    </div>
                  </div>
                </div>
              </div>

              {!appState.isPro ? (
                <button
                  onClick={handleBecomePro}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-4 text-xl font-bold hover:from-yellow-700 hover:to-yellow-800 transition-colors rounded-xl shadow-lg"
                >
                  ✨ Pro Member werden
                </button>
              ) : (
                <div className="text-center py-4 px-6 bg-yellow-100 rounded-xl border-2 border-yellow-500">
                  <div className="text-lg font-bold" style={{ color: '#2d2e2e' }}>✨ Pro Aktiv</div>
                </div>
              )}

              <p className="text-xs text-center mt-4" style={{ color: '#999' }}>
                Ein Bekenntnis zu deinem Erfolg
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
      </div>

      {/* Member Dialog */}
      <ConfirmDialog
        title="📁 Member werden"
        message="Sichere alle deine Erfolge!\n\nFür nur 0,99€/Monat erhältst du:\n\n📸 Unbegrenzte Archivierung aller Zettel\n☁️ Sicherer Cloud-Speicher\n📚 Dein komplettes Erfolgs-Archiv\n\nKostenlos testen: Die ersten 14 Zettel sind gratis!"
        isOpen={showMemberDialog}
        onClose={() => setShowMemberDialog(false)}
        buttons={[
          {
            text: 'Jetzt Member werden',
            action: confirmBecomeMember,
            primary: true,
          },
          {
            text: 'Nicht jetzt',
            action: () => setShowMemberDialog(false),
          },
        ]}
      />

      {/* Pro Dialog */}
      <ConfirmDialog
        title="✨ Pro Member werden"
        message="Du bist bereit für das nächste Level!\n\nFür 4,99€/Monat erhältst du:\n\n🃏 Jeden Monat einen Extra-Joker\n🛒 20% Rabatt im Shop\n🌍 Teile deine Meilensteine\n💚 Unterstütze soziale Projekte\n\nBist du bereit für dieses Bekenntnis?"
        isOpen={showProDialog}
        onClose={() => setShowProDialog(false)}
        buttons={[
          {
            text: '✨ Ja, Pro Member werden',
            action: confirmBecomePro,
            primary: true,
          },
          {
            text: 'Nicht jetzt',
            action: () => setShowProDialog(false),
          },
        ]}
      />
    </div>
  );
}
