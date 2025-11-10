'use client';

import { useState, useEffect } from 'react';
import { getAppState, saveAppState } from '@/lib/storage';
import { requestNotificationPermission, updateNotificationSettings, scheduleNotifications } from '@/lib/notifications';

export default function Settings() {
  const [appState, setAppState] = useState(getAppState());
  const [userName, setUserName] = useState(appState.userName);
  const [saved, setSaved] = useState(false);

  // Notification settings
  const [notifEnabled, setNotifEnabled] = useState(appState.notificationSettings.enabled);
  const [notifCount, setNotifCount] = useState<0 | 1 | 2 | 3>(appState.notificationSettings.count);
  const [morningTime, setMorningTime] = useState(appState.notificationSettings.morning);
  const [afternoonTime, setAfternoonTime] = useState(appState.notificationSettings.afternoon);
  const [eveningTime, setEveningTime] = useState(appState.notificationSettings.evening);
  const [notifSaved, setNotifSaved] = useState(false);

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

  const handleEnableNotifications = async () => {
    if (!notifEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotifEnabled(true);
        setNotifCount(1); // Default to 1 notification
      } else {
        alert('Benachrichtigungen wurden abgelehnt. Bitte erlaube sie in den Browser-Einstellungen.');
      }
    } else {
      setNotifEnabled(false);
      setNotifCount(0);
    }
  };

  const handleSaveNotifications = () => {
    updateNotificationSettings(
      notifEnabled,
      notifCount,
      morningTime,
      afternoonTime,
      eveningTime
    );
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  useEffect(() => {
    // Initialize notifications on mount
    scheduleNotifications();
  }, []);

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

        {/* Notifications Section */}
        <div className="bg-white border-4 border-brown p-6 md:p-8 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-brown mb-6">🔔 Benachrichtigungen</h2>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 bg-vintage/20 border-2 border-brown/30">
              <div>
                <div className="font-bold text-brown">Benachrichtigungen</div>
                <div className="text-sm text-brown/70">
                  {notifEnabled ? 'Aktiviert' : 'Deaktiviert'}
                </div>
              </div>
              <button
                onClick={handleEnableNotifications}
                className={`px-6 py-2 font-bold border-4 transition-colors ${
                  notifEnabled
                    ? 'bg-brown text-cream border-brown'
                    : 'bg-cream text-brown border-brown hover:bg-vintage/30'
                }`}
              >
                {notifEnabled ? 'Deaktivieren' : 'Aktivieren'}
              </button>
            </div>

            {notifEnabled && (
              <>
                {/* Notification Count */}
                <div>
                  <label className="block text-lg font-bold text-brown mb-3">
                    Anzahl der Benachrichtigungen pro Tag
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => setNotifCount(count as 0 | 1 | 2 | 3)}
                        className={`py-4 text-xl font-bold border-4 transition-all ${
                          notifCount === count
                            ? 'bg-brown text-cream border-brown scale-105'
                            : 'bg-white text-brown border-brown hover:bg-vintage/20'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-brown/60 mt-2">
                    {notifCount === 0 && 'Keine Benachrichtigungen'}
                    {notifCount === 1 && 'Eine Benachrichtigung pro Tag'}
                    {notifCount === 2 && 'Zwei Benachrichtigungen pro Tag'}
                    {notifCount === 3 && 'Drei Benachrichtigungen pro Tag'}
                  </p>
                </div>

                {/* Time Settings */}
                {notifCount >= 1 && (
                  <div>
                    <label className="block text-lg font-bold text-brown mb-2">
                      🌅 Morgens
                    </label>
                    <input
                      type="time"
                      value={morningTime}
                      onChange={(e) => setMorningTime(e.target.value)}
                      className="w-full border-4 border-brown p-4 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-brown/50"
                    />
                  </div>
                )}

                {notifCount >= 2 && (
                  <div>
                    <label className="block text-lg font-bold text-brown mb-2">
                      ☀️ Mittags
                    </label>
                    <input
                      type="time"
                      value={afternoonTime}
                      onChange={(e) => setAfternoonTime(e.target.value)}
                      className="w-full border-4 border-brown p-4 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-brown/50"
                    />
                  </div>
                )}

                {notifCount >= 3 && (
                  <div>
                    <label className="block text-lg font-bold text-brown mb-2">
                      🌙 Abends
                    </label>
                    <input
                      type="time"
                      value={eveningTime}
                      onChange={(e) => setEveningTime(e.target.value)}
                      className="w-full border-4 border-brown p-4 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-brown/50"
                    />
                  </div>
                )}

                <button
                  onClick={handleSaveNotifications}
                  className="w-full bg-brown text-cream px-6 py-3 text-lg font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg"
                >
                  {notifSaved ? '✓ Gespeichert!' : 'Benachrichtigungen speichern'}
                </button>
              </>
            )}
          </div>
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
