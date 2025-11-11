'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/context';
import { updateProfile } from '@/lib/supabase/database';
import { signOut } from '@/lib/supabase/auth';
import { requestNotificationPermission, updateNotificationSettings, scheduleNotifications } from '@/lib/notifications';
import { downloadCalendarEvent, isMobileDevice, openInCalendarApp } from '@/lib/calendar';
import {
  isPushSupported,
  initializePushNotifications,
  requestPushPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isPushSubscribed,
  sendTestPush,
  setupScheduledNotifications
} from '@/lib/pushNotifications';
import { redirectToCheckout } from '@/lib/stripe/client';
import ConfirmDialog from './ConfirmDialog';
import AuthModal from './AuthModal';

export default function Settings() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [userName, setUserName] = useState('');
  const [saved, setSaved] = useState(false);

  // Notification settings
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [morningEnabled, setMorningEnabled] = useState(false);
  const [afternoonEnabled, setAfternoonEnabled] = useState(false);
  const [eveningEnabled, setEveningEnabled] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [showNotifDialog, setShowNotifDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Push notifications state
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);

  // Initialize state from profile
  useEffect(() => {
    if (profile) {
      setUserName(profile.user_name || '');
      setNotifEnabled(profile.notification_settings.enabled);
      setMorningEnabled(profile.notification_settings.morning);
      setAfternoonEnabled(profile.notification_settings.afternoon);
      setEveningEnabled(profile.notification_settings.evening);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        user_name: userName.trim(),
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Fehler beim Speichern. Bitte versuche es erneut.');
    }
  };

  const handleResetOnboarding = () => {
    setShowResetDialog(true);
  };

  const confirmResetOnboarding = async () => {
    try {
      await updateProfile({
        has_completed_onboarding: false,
      });
      window.location.reload();
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      alert('Fehler beim Zurücksetzen. Bitte versuche es erneut.');
    }
  };

  const handleClearData = () => {
    setShowClearDialog(true);
  };

  const confirmClearData = async () => {
    try {
      // Sign out which will clear local cache
      await signOut();
      // TODO: Add server function to delete all user data
      alert('Alle Daten wurden gelöscht.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Fehler beim Löschen. Bitte versuche es erneut.');
    }
  };

  const handleUpgradeToPro = () => {
    setShowProDialog(true);
  };

  const confirmUpgradeToPro = async () => {
    try {
      // TODO: Integrate payment processing
      await updateProfile({
        is_pro: true,
        has_paid: true,
      });
      await refreshProfile();
      alert('🎉 Willkommen als Pro Member! Du erhältst jetzt alle Pro-Vorteile.');
    } catch (error) {
      console.error('Error upgrading to pro:', error);
      alert('Fehler beim Upgrade. Bitte versuche es erneut.');
    }
  };

  const handleBecomeMember = async () => {
    try {
      // Redirect to Stripe Checkout
      await redirectToCheckout();
    } catch (error: any) {
      console.error('Error redirecting to checkout:', error);
      alert('Fehler beim Öffnen der Zahlung. Bitte versuche es erneut.');
    }
  };

  const confirmBecomeMember = async () => {
    // This function is no longer needed as payment is handled by Stripe
    // Keeping it for backward compatibility with existing dialog
    await handleBecomeMember();
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
      setMorningEnabled(true);
    } else {
      alert('Benachrichtigungen wurden abgelehnt. Bitte erlaube sie in den Browser-Einstellungen.');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      updateNotificationSettings(
        notifEnabled,
        morningEnabled,
        afternoonEnabled,
        eveningEnabled
      );

      await updateProfile({
        notification_settings: {
          enabled: notifEnabled,
          morning: morningEnabled,
          afternoon: afternoonEnabled,
          evening: eveningEnabled,
        },
      });

      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    } catch (error) {
      console.error('Error saving notifications:', error);
      alert('Fehler beim Speichern. Bitte versuche es erneut.');
    }
  };

  const handleAddToCalendar = () => {
    if (isMobileDevice()) {
      openInCalendarApp();
    } else {
      downloadCalendarEvent();
    }
  };

  useEffect(() => {
    scheduleNotifications();

    const checkPushSupport = async () => {
      const supported = isPushSupported();
      setPushSupported(supported);

      if (supported) {
        await initializePushNotifications();
        const subscribed = await isPushSubscribed();
        setPushSubscribed(subscribed);
        setPushEnabled(subscribed);
      }
    };

    checkPushSupport();
  }, []);

  const handleEnablePush = async () => {
    if (!pushEnabled) {
      const permitted = await requestPushPermission();
      if (permitted) {
        const subscription = await subscribeToPush();
        if (subscription) {
          setPushEnabled(true);
          setPushSubscribed(true);
          await setupScheduledNotifications(morningEnabled, afternoonEnabled, eveningEnabled);
          alert('✅ Push-Benachrichtigungen aktiviert! Du erhältst jetzt Erinnerungen auch wenn die App geschlossen ist.');
        } else {
          alert('❌ Fehler beim Aktivieren der Push-Benachrichtigungen.');
        }
      } else {
        alert('❌ Push-Benachrichtigungen wurden abgelehnt. Bitte erlaube sie in den Browser-Einstellungen.');
      }
    } else {
      const unsubscribed = await unsubscribeFromPush();
      if (unsubscribed) {
        setPushEnabled(false);
        setPushSubscribed(false);
        alert('Push-Benachrichtigungen deaktiviert.');
      }
    }
  };

  const handleTestPush = async () => {
    const sent = await sendTestPush();
    if (sent) {
      alert('✅ Test-Benachrichtigung gesendet!');
    } else {
      alert('❌ Fehler beim Senden der Test-Benachrichtigung.');
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Fehler beim Abmelden. Bitte versuche es erneut.');
    }
  };

  // Show loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold" style={{ color: '#2d2e2e' }}>
          Lädt...
        </div>
      </div>
    );
  }

  // Show auth modal if not logged in
  if (!user || !profile) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        onSuccess={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
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
                E-Mail
              </label>
              <div className="w-full border-2 rounded-xl p-4 text-lg bg-gray-50" style={{ borderColor: '#e0e0e0', color: '#666' }}>
                {user?.email}
              </div>
            </div>

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
                {profile.current_streak}
              </div>
              <div className="text-sm" style={{ color: '#666' }}>Tage Streak</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                {profile.total_commitments}
              </div>
              <div className="text-sm" style={{ color: '#666' }}>Bekenntnisse</div>
            </div>
          </div>

          {profile.ten_year_vision && (
            <div className="mt-6 pt-6 border-t-2" style={{ borderColor: '#e0e0e0' }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Deine 10-Jahres-Vision
              </h3>
              <p className="italic whitespace-pre-line" style={{ color: '#666' }}>
                {profile.ten_year_vision}
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
                {profile.has_paid ? '✓ Premium Member (0,99€/Monat)' : 'Free Trial'}
              </div>
              {!profile.has_paid && (
                <div className="text-sm mt-2 font-medium" style={{ color: '#666' }}>
                  Noch {Math.max(0, 14 - profile.total_commitments)} Zettel kostenlos
                </div>
              )}
            </div>

            {/* Membership Upgrade */}
            {!profile.has_paid && (
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
                </div>

                <button
                  onClick={handleBecomeMember}
                  className="w-full bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
                >
                  Jetzt Member werden
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pro Subscription Section */}
        {profile.current_streak >= 30 && !profile.is_pro && (
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Werde Pro Member
              </h2>
              <p className="mb-6" style={{ color: '#666' }}>
                Du hast {profile.current_streak} Tage durchgezogen! Zeit für das nächste Level.
              </p>

              <button
                onClick={handleUpgradeToPro}
                className="w-full bg-black text-white px-8 py-4 text-xl font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
              >
                ✨ Jetzt Pro Member werden
              </button>
            </div>
          </div>
        )}

        {/* Pro Status Display */}
        {profile.is_pro && (
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#2d2e2e' }}>
                Pro Member
              </h2>
              <p className="mb-4" style={{ color: '#666' }}>
                Danke für dein Bekenntnis! Du unterstützt soziale Projekte und inspirierst andere.
              </p>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>🔔 Benachrichtigungen</h2>

          <div className="space-y-6">
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

        {/* Push Notifications Section */}
        {pushSupported && (
          <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>🔔 Push-Benachrichtigungen</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white border-2 rounded-xl" style={{ borderColor: '#e0e0e0' }}>
                <div>
                  <div className="font-bold" style={{ color: '#2d2e2e' }}>Push-Benachrichtigungen</div>
                  <div className="text-sm" style={{ color: '#666' }}>
                    {pushEnabled ? '✅ Aktiviert' : '⚪ Deaktiviert'}
                  </div>
                </div>
                <button
                  onClick={handleEnablePush}
                  className={`px-6 py-2 font-bold border-2 rounded-xl transition-colors ${
                    pushEnabled
                      ? 'bg-black text-white hover:bg-gray-900'
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                  style={{ borderColor: '#e0e0e0' }}
                >
                  {pushEnabled ? 'Deaktivieren' : 'Aktivieren'}
                </button>
              </div>

              {pushEnabled && (
                <button
                  onClick={handleTestPush}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 text-lg font-bold hover:from-green-600 hover:to-teal-600 transition-colors rounded-xl shadow-md"
                >
                  🔔 Test-Benachrichtigung senden
                </button>
              )}
            </div>
          </div>
        )}

        {/* Calendar Integration Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>📅 Kalender-Integration</h2>

          <div className="space-y-6">
            <p className="text-base" style={{ color: '#666' }}>
              Füge eine tägliche Erinnerung zu deinem Kalender hinzu. Das Upload-Fenster ist täglich von <strong>20:00 - 02:00 Uhr</strong>.
            </p>

            <button
              onClick={handleAddToCalendar}
              className="w-full bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
            >
              📅 Zu Kalender hinzufügen
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>💬 Support</h2>

          <div className="space-y-6">
            <p className="text-base" style={{ color: '#666' }}>
              Brauchst du Hilfe oder hast Fragen? Wir sind für dich da!
            </p>

            {/* FAQ Section */}
            <div className="space-y-4">
              <div className="p-4 border-2 rounded-xl" style={{ borderColor: '#e0e0e0' }}>
                <h3 className="font-bold mb-2" style={{ color: '#2d2e2e' }}>❓ Häufig gestellte Fragen</h3>
                <ul className="space-y-2 text-sm" style={{ color: '#666' }}>
                  <li>• <strong>Wann kann ich Zettel hochladen?</strong><br />Täglich zwischen 20:00 - 02:00 Uhr (Die Stunde des Wolfs)</li>
                  <li>• <strong>Was passiert bei einem Streak-Verlust?</strong><br />Joker werden automatisch verwendet, wenn du einen hast</li>
                  <li>• <strong>Wie bekomme ich Joker?</strong><br />Alle 7 Tage Streak erhältst du automatisch einen Joker</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="p-4 border-2 rounded-xl" style={{ borderColor: '#e0e0e0' }}>
              <h3 className="font-bold mb-2" style={{ color: '#2d2e2e' }}>📧 Kontakt</h3>
              <p className="text-sm mb-3" style={{ color: '#666' }}>
                Hast du Fragen, Feedback oder Probleme? Schreib uns!
              </p>
              <a
                href="mailto:support@papyr.app"
                className="inline-block bg-black text-white px-6 py-3 text-base font-bold hover:bg-gray-900 transition-colors rounded-xl shadow-md"
              >
                ✉️ support@papyr.app
              </a>
            </div>

            {/* Version */}
            <div className="text-center text-sm" style={{ color: '#999' }}>
              PAPYR Version 1.0.0
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white border-2 rounded-xl p-6 md:p-8 mb-6 shadow-lg" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>Account-Aktionen</h2>

          <button
            onClick={handleLogout}
            className="w-full bg-white text-black px-6 py-3 text-lg font-bold border-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            style={{ borderColor: '#e0e0e0' }}
          >
            🚪 Abmelden
          </button>
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

      {/* All Dialogs */}
      <ConfirmDialog
        title="Benachrichtigungen aktivieren"
        message="Möchtest du tägliche Erinnerungen erhalten? Du wirst jeden Tag zur richtigen Zeit daran erinnert, deinen Zettel zu schreiben."
        isOpen={showNotifDialog}
        onClose={() => setShowNotifDialog(false)}
        buttons={[
          { text: '✓ Ja, erinnere mich!', action: confirmEnableNotifications, primary: true },
          { text: 'Nicht jetzt', action: () => {} },
        ]}
      />

      <ConfirmDialog
        title="Onboarding zurücksetzen"
        message="Möchtest du wirklich das Onboarding zurücksetzen? Du bleibst eingeloggt und behältst alle deine Daten."
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        buttons={[
          { text: 'Ja, zurücksetzen', action: confirmResetOnboarding, primary: true },
          { text: 'Abbrechen', action: () => {} },
        ]}
      />

      <ConfirmDialog
        title="⚠️ ACHTUNG"
        message="ALLE Daten werden unwiderruflich gelöscht! Dieser Vorgang kann NICHT rückgängig gemacht werden!"
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        buttons={[
          { text: 'Ja, alles löschen', action: confirmClearData, danger: true },
          { text: 'Abbrechen', action: () => {}, primary: true },
        ]}
      />

      <ConfirmDialog
        title="✨ Pro Member werden"
        message="Für 4,99€/Monat erhältst du Extra-Joker, Shop-Rabatte und unterstützt soziale Projekte."
        isOpen={showProDialog}
        onClose={() => setShowProDialog(false)}
        buttons={[
          { text: '✨ Ja, Pro werden', action: confirmUpgradeToPro, primary: true },
          { text: 'Nicht jetzt', action: () => {} },
        ]}
      />

      <ConfirmDialog
        title="📁 Member werden"
        message="Für nur 0,99€/Monat: Unbegrenzte Archivierung, sicherer Cloud-Speicher. Die ersten 14 Zettel sind gratis!"
        isOpen={showMemberDialog}
        onClose={() => setShowMemberDialog(false)}
        buttons={[
          { text: 'Jetzt Member werden', action: confirmBecomeMember, primary: true },
          { text: 'Nicht jetzt', action: () => {} },
        ]}
      />

      {/* Logout Dialog */}
      <ConfirmDialog
        title="🚪 Abmelden"
        message="Möchtest du dich wirklich abmelden?\n\nDeine Daten sind sicher gespeichert und du kannst dich jederzeit wieder anmelden."
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        buttons={[
          { text: 'Ja, abmelden', action: confirmLogout, primary: true },
          { text: 'Abbrechen', action: () => {} },
        ]}
      />
    </div>
  );
}
