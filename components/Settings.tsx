'use client';

import { useState, useEffect } from 'react';
import { getAppState, saveAppState } from '@/lib/storage';
import { requestNotificationPermission, updateNotificationSettings, scheduleNotifications } from '@/lib/notifications';
import { downloadCalendarEvent, isMobileDevice, openInCalendarApp } from '@/lib/calendar';
import ConfirmDialog from './ConfirmDialog';

export default function Settings() {
  const [appState, setAppState] = useState(getAppState());
  const [userName, setUserName] = useState(appState.userName);
  const [saved, setSaved] = useState(false);

  // Notification settings
  const [notifEnabled, setNotifEnabled] = useState(appState.notificationSettings.enabled);
  const [morningEnabled, setMorningEnabled] = useState(appState.notificationSettings.morning);
  const [afternoonEnabled, setAfternoonEnabled] = useState(appState.notificationSettings.afternoon);
  const [eveningEnabled, setEveningEnabled] = useState(appState.notificationSettings.evening);
  const [notifSaved, setNotifSaved] = useState(false);
  const [showNotifDialog, setShowNotifDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);

  const handleSave = () => {
    const state = getAppState();
    state.userName = userName.trim();
    saveAppState(state);
    setAppState(state);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetOnboarding = () => {
    setShowResetDialog(true);
  };

  const confirmResetOnboarding = () => {
    const state = getAppState();
    state.hasCompletedOnboarding = false;
    saveAppState(state);
    window.location.reload();
  };

  const handleClearData = () => {
    setShowClearDialog(true);
  };

  const confirmClearData = () => {
    localStorage.removeItem('papyr_state');
    window.location.reload();
  };

  const handleUpgradeToPro = () => {
    setShowProDialog(true);
  };

  const confirmUpgradeToPro = () => {
    // TODO: Integrate payment processing
    // For now, just set isPro to true
    const state = getAppState();
    state.isPro = true;
    state.hasPaid = true;
    saveAppState(state);
    setAppState(state);
    alert('🎉 Willkommen als Pro Member! Du erhältst jetzt alle Pro-Vorteile.');
  };

  const handleBecomeMember = () => {
    setShowMemberDialog(true);
  };

  const confirmBecomeMember = () => {
    // TODO: Integrate payment processing
    // For now, just set hasPaid to true
    const state = getAppState();
    state.hasPaid = true;
    saveAppState(state);
    setAppState(state);
    alert('🎉 Willkommen als Member! Deine Zettel werden jetzt unbegrenzt gespeichert.');
  };

  const handleEnableNotifications = () => {
    if (!notifEnabled) {
      setShowNotifDialog(true);
    } else {
      setNotifEnabled(false);
      setMorningEnabled(false);
      setAfternoonEnabled(false);
      setEveningEnabled(false);
    }
  };

  const confirmEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotifEnabled(true);
      setMorningEnabled(true); // Default to morning notification
    } else {
      alert('Benachrichtigungen wurden abgelehnt. Bitte erlaube sie in den Browser-Einstellungen.');
    }
  };

  const handleSaveNotifications = () => {
    updateNotificationSettings(
      notifEnabled,
      morningEnabled,
      afternoonEnabled,
      eveningEnabled
    );
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  const handleAddToCalendar = () => {
    if (isMobileDevice()) {
      // On mobile, try to open directly in calendar app
      openInCalendarApp();
    } else {
      // On desktop, download the .ics file
      downloadCalendarEvent();
    }
  };

  useEffect(() => {
    // Initialize notifications on mount
    scheduleNotifications();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#2d2e2e' }}>
          Einstellungen
        </h1>

        {/* Profile Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>Profil</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-lg font-bold mb-2" style={{ color: '#2d2e2e' }}>
                Dein Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border-2 rounded-xl p-4 text-lg bg-white focus:outline-none focus:ring-2"
                style={{ borderColor: '#e0e0e0', color: '#2d2e2e' }}
                placeholder="Wie heißt du?"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
            >
              {saved ? '✓ Gespeichert!' : 'Speichern'}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>Statistiken</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                {appState.currentStreak}
              </div>
              <div className="text-sm" style={{ color: '#666' }}>Tage Streak</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                {appState.commitments.length}
              </div>
              <div className="text-sm" style={{ color: '#666' }}>Bekenntnisse</div>
            </div>
          </div>

          {appState.tenYearVision && (
            <div className="mt-6 pt-6 border-t-2" style={{ borderColor: '#e0e0e0' }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Deine 10-Jahres-Vision
              </h3>
              <p className="italic whitespace-pre-line" style={{ color: '#666' }}>
                {appState.tenYearVision}
              </p>
            </div>
          )}
        </div>

        {/* Account & Membership Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>Account</h2>

          <div className="space-y-4">
            {/* Current Status */}
            <div className="p-4 bg-white border-2 rounded-xl" style={{ borderColor: '#e0e0e0' }}>
              <div className="font-bold mb-1" style={{ color: '#2d2e2e' }}>Aktueller Status</div>
              <div className="text-sm" style={{ color: '#666' }}>
                {appState.hasPaid ? '✓ Premium Member (0,99€/Monat)' : 'Free Trial'}
              </div>
              {!appState.hasPaid && (
                <div className="text-sm mt-2 font-medium" style={{ color: '#666' }}>
                  Noch {Math.max(0, 14 - appState.commitments.length)} Zettel kostenlos
                </div>
              )}
            </div>

            {/* Membership Upgrade - Only show if not paid yet */}
            {!appState.hasPaid && (
              <div className="border-2 rounded-xl p-6" style={{ borderColor: '#e0e0e0' }}>
                <div className="text-center mb-5">
                  <div className="text-3xl mb-2">📁</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                    Werde Member
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#666' }}>
                    Unbegrenztes Archiv für alle deine Erfolge
                  </p>

                  <div className="bg-white border-2 rounded-xl p-4 mb-5" style={{ borderColor: '#e0e0e0' }}>
                    <div className="text-2xl font-bold" style={{ color: '#2d2e2e' }}>
                      0,99€ <span className="text-base font-normal">/Monat</span>
                    </div>
                    <div className="text-xs italic mt-1" style={{ color: '#666' }}>
                      Dein digitaler Aktenschrank
                    </div>
                  </div>

                  <div className="text-left space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <div className="text-lg">📸</div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: '#2d2e2e' }}>Unbegrenzte Archivierung</div>
                        <div className="text-xs" style={{ color: '#666' }}>
                          Alle deine Zettel werden dauerhaft gespeichert
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-lg">☁️</div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: '#2d2e2e' }}>Cloud-Speicher</div>
                        <div className="text-xs" style={{ color: '#666' }}>
                          Zugriff von überall, immer sicher
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-lg">📚</div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: '#2d2e2e' }}>Dein Erfolgs-Archiv</div>
                        <div className="text-xs" style={{ color: '#666' }}>
                          Dokumentiere deinen kompletten Weg
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBecomeMember}
                  className="w-full bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
                >
                  Jetzt Member werden
                </button>

                <p className="text-xs text-center mt-3" style={{ color: '#999' }}>
                  Kostenlos testen: Deine ersten 14 Zettel sind gratis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pro Subscription Section - Only show if streak >= 30 */}
        {appState.currentStreak >= 30 && !appState.isPro && (
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Werde Pro Member
              </h2>
              <p className="mb-6" style={{ color: '#666' }}>
                Du hast {appState.currentStreak} Tage durchgezogen! Zeit für das nächste Level.
              </p>

              <div className="bg-white border-2 rounded-xl p-5 mb-6" style={{ borderColor: '#e0e0e0' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                  4,99€ <span className="text-lg font-normal">/Monat</span>
                </div>
                <div className="text-sm italic" style={{ color: '#666' }}>
                  Ein Bekenntnis. Ein Statement.
                </div>
              </div>

              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-xl">🃏</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Extra-Joker jeden Monat</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Zusätzlicher Schutz für deinen Streak
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl">🛒</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>20% Rabatt im Shop</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Dauerhaft auf alle Produkte
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl">🌍</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Teile deine Meilensteine</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Inspiriere die Community
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl">💚</div>
                  <div>
                    <div className="font-bold" style={{ color: '#2d2e2e' }}>Unterstütze soziale Projekte</div>
                    <div className="text-sm" style={{ color: '#666' }}>
                      Jede Mitgliedschaft hilft anderen
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpgradeToPro}
                className="w-full bg-black text-white px-8 py-4 text-xl font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
              >
                ✨ Jetzt Pro Member werden
              </button>

              <p className="text-xs mt-4" style={{ color: '#999' }}>
                Du hast bereits alles, was du brauchst: Zettel, Stift, Disziplin. Pro ist ein Bekenntnis.
              </p>
            </div>
          </div>
        )}

        {/* Pro Status Display - If already Pro */}
        {appState.isPro && (
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Pro Member
              </h2>
              <p className="mb-4" style={{ color: '#666' }}>
                Danke für dein Bekenntnis! Du unterstützt soziale Projekte und inspirierst andere.
              </p>
              <div className="bg-white border-2 rounded-xl p-4" style={{ borderColor: '#e0e0e0' }}>
                <div className="text-sm" style={{ color: '#666' }}>
                  🃏 Extra-Joker jeden Monat<br />
                  🛒 20% Rabatt im Shop<br />
                  🌍 Teile deine Meilensteine
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>🔔 Benachrichtigungen</h2>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 bg-white border-2 rounded-xl" style={{ borderColor: '#e0e0e0' }}>
              <div>
                <div className="font-bold" style={{ color: '#2d2e2e' }}>Benachrichtigungen</div>
                <div className="text-sm" style={{ color: '#666' }}>
                  {notifEnabled ? 'Aktiviert' : 'Deaktiviert'}
                </div>
              </div>
              <button
                onClick={handleEnableNotifications}
                className={`px-6 py-2 font-bold border-2 rounded-xl transition-colors ${
                  notifEnabled
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
                style={{ borderColor: '#e0e0e0' }}
              >
                {notifEnabled ? 'Deaktivieren' : 'Aktivieren'}
              </button>
            </div>

            {notifEnabled && (
              <>
                <div>
                  <label className="block text-lg font-bold mb-4" style={{ color: '#2d2e2e' }}>
                    Wähle deine Erinnerungszeiten
                  </label>
                  <div className="space-y-3">
                    {/* Morning Checkbox */}
                    <label className="flex items-center justify-between p-4 bg-white border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#e0e0e0' }}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={morningEnabled}
                          onChange={(e) => setMorningEnabled(e.target.checked)}
                          className="w-6 h-6 cursor-pointer"
                          style={{ accentColor: '#2d2e2e' }}
                        />
                        <div>
                          <div className="font-bold" style={{ color: '#2d2e2e' }}>🌅 Morgens</div>
                          <div className="text-sm" style={{ color: '#666' }}>09:30 Uhr</div>
                        </div>
                      </div>
                    </label>

                    {/* Afternoon Checkbox */}
                    <label className="flex items-center justify-between p-4 bg-white border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#e0e0e0' }}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={afternoonEnabled}
                          onChange={(e) => setAfternoonEnabled(e.target.checked)}
                          className="w-6 h-6 cursor-pointer"
                          style={{ accentColor: '#2d2e2e' }}
                        />
                        <div>
                          <div className="font-bold" style={{ color: '#2d2e2e' }}>☀️ Mittags</div>
                          <div className="text-sm" style={{ color: '#666' }}>15:00 Uhr</div>
                        </div>
                      </div>
                    </label>

                    {/* Evening Checkbox */}
                    <label className="flex items-center justify-between p-4 bg-white border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#e0e0e0' }}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={eveningEnabled}
                          onChange={(e) => setEveningEnabled(e.target.checked)}
                          className="w-6 h-6 cursor-pointer"
                          style={{ accentColor: '#2d2e2e' }}
                        />
                        <div>
                          <div className="font-bold" style={{ color: '#2d2e2e' }}>🌙 Abends</div>
                          <div className="text-sm" style={{ color: '#666' }}>19:00 Uhr</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveNotifications}
                  className="w-full bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
                >
                  {notifSaved ? '✓ Gespeichert!' : 'Benachrichtigungen speichern'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Calendar Integration Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>📅 Kalender-Integration</h2>

          <div className="space-y-6">
            <p className="text-base" style={{ color: '#666' }}>
              Füge eine tägliche Erinnerung zu deinem Kalender hinzu. Das Upload-Fenster ist täglich von <strong>20:00 - 02:00 Uhr</strong>.
            </p>

            {/* Daily Reminder Card */}
            <div className="bg-white border-2 rounded-xl p-5" style={{ borderColor: '#e0e0e0' }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">📝</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#2d2e2e' }}>
                    Tägliche PAPYR Erinnerung
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: '#666' }}>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span><strong>Täglich</strong> von 20:00 - 02:00 Uhr</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔔</span>
                      <span>Erinnerung 15 Minuten vorher (19:45 Uhr)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔁</span>
                      <span>Wiederholt sich automatisch jeden Tag</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCalendar}
                className="w-full bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
              >
                📅 Zu Kalender hinzufügen
              </button>

              <p className="text-xs text-center mt-3" style={{ color: '#999' }}>
                Funktioniert mit Google Calendar, Apple Kalender, Outlook und allen anderen Kalender-Apps
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 rounded-xl p-4" style={{ borderColor: '#e0e0e0' }}>
              <div className="flex items-start gap-3">
                <div className="text-xl">💡</div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={{ color: '#2d2e2e' }}>
                    So funktioniert's:
                  </p>
                  <ul className="text-xs space-y-1" style={{ color: '#666' }}>
                    <li><strong>Desktop:</strong> Die .ics Datei wird heruntergeladen. Öffne sie mit deinem Kalender.</li>
                    <li><strong>Mobile:</strong> Der Kalender-Event öffnet sich direkt in deiner Kalender-App.</li>
                    <li><strong>Danach:</strong> Bestätige den wiederkehrenden Event - fertig! 🎉</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border-2 border-red-600 rounded-xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h2>

          <div className="space-y-4">
            <button
              onClick={handleResetOnboarding}
              className="w-full bg-white px-6 py-3 text-lg font-medium border-2 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}
            >
              Onboarding zurücksetzen
            </button>

            <button
              onClick={handleClearData}
              className="w-full bg-red-600 text-white px-6 py-3 text-lg font-bold hover:bg-red-700 transition-colors border-2 border-red-600 rounded-xl"
            >
              Alle Daten löschen
            </button>
          </div>
        </div>
      </div>

      {/* Notification Permission Dialog */}
      <ConfirmDialog
        title="Benachrichtigungen aktivieren"
        message="Möchtest du tägliche Erinnerungen erhalten? Du wirst jeden Tag zur richtigen Zeit daran erinnert, deinen Zettel zu schreiben."
        isOpen={showNotifDialog}
        onClose={() => setShowNotifDialog(false)}
        buttons={[
          {
            text: '✓ Ja, erinnere mich!',
            action: confirmEnableNotifications,
            primary: true,
          },
          {
            text: 'Nicht jetzt',
            action: () => {},
          },
        ]}
      />

      {/* Reset Onboarding Dialog */}
      <ConfirmDialog
        title="Onboarding zurücksetzen"
        message="Möchtest du wirklich das Onboarding zurücksetzen? Du bleibst eingeloggt und behältst alle deine Daten. Nur das Onboarding wird neu gestartet."
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        buttons={[
          {
            text: 'Ja, zurücksetzen',
            action: confirmResetOnboarding,
            primary: true,
          },
          {
            text: 'Abbrechen',
            action: () => {},
          },
        ]}
      />

      {/* Clear Data Dialog */}
      <ConfirmDialog
        title="⚠️ ACHTUNG"
        message="ALLE Daten werden unwiderruflich gelöscht!\n\nDas umfasst:\n• Alle Bekenntnisse\n• Deinen Streak\n• Deine Jokers\n• Alle Einstellungen\n\nDieser Vorgang kann NICHT rückgängig gemacht werden!"
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        buttons={[
          {
            text: 'Ja, alles löschen',
            action: confirmClearData,
            danger: true,
          },
          {
            text: 'Abbrechen',
            action: () => {},
            primary: true,
          },
        ]}
      />

      {/* Pro Upgrade Dialog */}
      <ConfirmDialog
        title="✨ Pro Member werden"
        message="Du bist bereit für das nächste Level!\n\nFür 4,99€/Monat erhältst du:\n\n🃏 Jeden Monat einen Extra-Joker\n🛒 20% Rabatt im Shop\n🌍 Teile deine Meilensteine\n💚 Unterstütze soziale Projekte\n\nDu hast {streak} Tage geschafft. Bist du bereit für dieses Bekenntnis?"
        isOpen={showProDialog}
        onClose={() => setShowProDialog(false)}
        buttons={[
          {
            text: '✨ Ja, Pro Member werden',
            action: confirmUpgradeToPro,
            primary: true,
          },
          {
            text: 'Nicht jetzt',
            action: () => {},
          },
        ]}
      />

      {/* Member Upgrade Dialog */}
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
            action: () => {},
          },
        ]}
      />
    </div>
  );
}
