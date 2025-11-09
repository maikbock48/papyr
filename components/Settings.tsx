'use client';

import { useState, useEffect } from 'react';
import { getAppState, saveAppState } from '@/lib/storage';

export default function Settings() {
  const [appState, setAppState] = useState(getAppState());
  const [userName, setUserName] = useState(appState.userName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const state = getAppState();
    state.userName = userName.trim();
    saveAppState(state);
    setAppState(state);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetOnboarding = () => {
    if (confirm('Möchtest du wirklich das Onboarding zurücksetzen? Du bleibst eingeloggt und behältst deine Daten.')) {
      const state = getAppState();
      state.hasCompletedOnboarding = false;
      saveAppState(state);
      window.location.reload();
    }
  };

  const handleClearData = () => {
    if (confirm('ACHTUNG: Alle Daten werden gelöscht! Bist du sicher?')) {
      if (confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden!')) {
        localStorage.removeItem('papyr_state');
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-brown mb-8">
          Einstellungen
        </h1>

        {/* Profile Section */}
        <div className="bg-white border-4 border-brown p-6 md:p-8 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-brown mb-6">Profil</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-lg font-bold text-brown mb-2">
                Dein Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border-4 border-brown p-4 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-brown/50"
                placeholder="Wie heißt du?"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-brown text-cream px-6 py-3 text-lg font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg"
            >
              {saved ? '✓ Gespeichert!' : 'Speichern'}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white border-4 border-brown p-6 md:p-8 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-brown mb-6">Statistiken</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-brown mb-2">
                {appState.currentStreak}
              </div>
              <div className="text-sm text-brown/70">Tage Streak</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-brown mb-2">
                {appState.commitments.length}
              </div>
              <div className="text-sm text-brown/70">Bekenntnisse</div>
            </div>
          </div>

          {appState.tenYearVision && (
            <div className="mt-6 pt-6 border-t-2 border-brown/20">
              <h3 className="text-lg font-bold text-brown mb-3">
                Deine 10-Jahres-Vision
              </h3>
              <p className="text-brown/80 italic whitespace-pre-line">
                {appState.tenYearVision}
              </p>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="bg-white border-4 border-brown p-6 md:p-8 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-brown mb-6">Account</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-vintage/20 border-2 border-brown/30">
              <div>
                <div className="font-bold text-brown">Status</div>
                <div className="text-sm text-brown/70">
                  {appState.hasPaid ? 'Premium (1€/Monat)' : 'Free Trial'}
                </div>
              </div>
              {!appState.hasPaid && (
                <div className="text-sm text-brown/60">
                  {14 - appState.commitments.length} Tage übrig
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border-4 border-red-600 p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h2>

          <div className="space-y-4">
            <button
              onClick={handleResetOnboarding}
              className="w-full bg-white text-brown px-6 py-3 text-lg font-medium border-2 border-brown hover:bg-vintage/30 transition-colors"
            >
              Onboarding zurücksetzen
            </button>

            <button
              onClick={handleClearData}
              className="w-full bg-red-600 text-white px-6 py-3 text-lg font-bold hover:bg-red-700 transition-colors border-4 border-red-600"
            >
              Alle Daten löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
