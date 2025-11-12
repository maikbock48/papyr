'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/context';
import {
  getCommitments,
  createCommitment,
  deleteCommitment as deleteCommitmentDB,
  markCommitmentCompleted as markCommitmentCompletedDB,
  canCommitToday as canCommitTodayDB,
  needsPaywall as needsPaywallDB,
  type Commitment
} from '@/lib/supabase/database';
import { isWithinWolfHour } from '@/lib/storage';
import { getTimeUntilNextWindow, formatCountdown } from '@/lib/countdown';
import ConfirmDialog from './ConfirmDialog';
import AddToHomeScreen from './AddToHomeScreen';
import AuthModal from './AuthModal';
import GoalsInputPopup from './GoalsInputPopup';

interface DashboardProps {
  onUpload: () => void;
  onPaywallRequired: () => void;
  globalPulse: number;
}

export default function Dashboard({ onUpload, onPaywallRequired, globalPulse }: DashboardProps) {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadChoice, setShowUploadChoice] = useState(false);
  const [uploadType, setUploadType] = useState<'camera' | 'gallery'>('camera');
  const [weekDaysToShow, setWeekDaysToShow] = useState(7);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showGoalsPopup, setShowGoalsPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const time = getTimeUntilNextWindow();
      setCountdown({ hours: time.hours, minutes: time.minutes, seconds: time.seconds });
    };

    updateCountdown(); // Initial update
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load commitments
  useEffect(() => {
    if (user && !authLoading) {
      loadCommitments();
    }
  }, [user, authLoading]);

  const loadCommitments = async () => {
    try {
      setLoading(true);
      const data = await getCommitments();
      setCommitments(data);
    } catch (error) {
      console.error('Error loading commitments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adjust number of days shown based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 430) {
        setWeekDaysToShow(7);
      } else if (width < 530) {
        setWeekDaysToShow(8);
      } else {
        setWeekDaysToShow(9);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCameraClick = async () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check paywall
    const needsPayment = await needsPaywallDB();
    if (needsPayment) {
      onPaywallRequired();
      return;
    }

    if (!isWithinWolfHour()) {
      alert('⏰ Die Stunde des Wolfs ist zwischen 20:00 und 02:00 Uhr. Komm dann wieder.');
      return;
    }

    const canCommit = await canCommitTodayDB();
    if (!canCommit) {
      alert('✅ Du hast heute bereits dein Bekenntnis abgelegt. Bis morgen Abend!');
      return;
    }

    setShowUploadChoice(true);
  };

  const handleUploadChoice = (type: 'camera' | 'gallery') => {
    setUploadType(type);
    setShowUploadChoice(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create a preview URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setUploadedFile(file);
      setUploadedImageUrl(imageUrl);
      setShowGoalsPopup(true);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error preparing image:', error);
      alert('Fehler beim Vorbereiten des Bildes. Bitte versuche es erneut.');
    }
  };

  const handleGoalsSubmit = async (goals: string, initials: string, signedImageBlob?: Blob) => {
    if (!uploadedFile) return;

    try {
      setUploading(true);

      // Use signed image if available, otherwise use original
      const fileToUpload = signedImageBlob
        ? new File([signedImageBlob], uploadedFile.name, { type: 'image/jpeg' })
        : uploadedFile;

      // Upload to Supabase with initials (empty string since signature is on image now)
      await createCommitment(fileToUpload, goals, '');

      // Refresh profile to update streak
      await refreshProfile();

      // Reload commitments
      await loadCommitments();

      // Clean up
      URL.revokeObjectURL(uploadedImageUrl);
      setUploadedFile(null);
      setUploadedImageUrl('');

      // Call parent onUpload callback
      onUpload();
    } catch (error) {
      console.error('Error uploading commitment:', error);
      alert('Fehler beim Hochladen. Bitte versuche es erneut.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchtest du diesen Zettel wirklich löschen? Das kann nicht rückgängig gemacht werden!')) {
      return;
    }

    try {
      await deleteCommitmentDB(id);
      await loadCommitments();
    } catch (error) {
      console.error('Error deleting commitment:', error);
      alert('Fehler beim Löschen. Bitte versuche es erneut.');
    }
  };

  const handleMarkCompleted = async (id: string) => {
    try {
      await markCommitmentCompletedDB(id);
      await loadCommitments();
    } catch (error) {
      console.error('Error marking as completed:', error);
      alert('Fehler beim Markieren. Bitte versuche es erneut.');
    }
  };

  const canMarkAsCompleted = (commitmentDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const commitDate = new Date(commitmentDate);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 1;
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold" style={{ color: '#2d2e2e' }}>
          Lädt...
        </div>
      </div>
    );
  }

  // Show auth modal if not logged in
  if (!user) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        onSuccess={() => window.location.reload()}
      />
    );
  }

  // Latest 3 commitments for preview
  const recentCommitments = commitments
    .filter(c => !c.is_developing)
    .slice(0, 3);

  const currentStreak = profile?.current_streak || 0;
  const canCommit = profile?.last_commitment_date !== new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen">
      {/* Block Image Section - at the top after navbar */}
      <div className="relative w-full min-h-screen">
        <img
          src="/assets/papyr-brand.png"
          alt="PAPYR Block"
          className="absolute left-1/2 -translate-x-1/2 w-auto object-contain"
          style={{
            maxWidth: '715px',
            height: 'auto',
            top: '20px',
            border: '2.5px solid black',
            borderRadius: '8px'
          }}
        />

        {/* Hero Section - Overlay on top of block */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Headline - Top */}
          <div className="pt-4 text-center">
            {!canCommit && (
              <p className="text-base md:text-lg" style={{ color: '#2d2e2e' }}>
                Dein Zettel ist Zettel {globalPulse.toLocaleString()}.
              </p>
            )}
          </div>


          {/* Mobile/Tablet - Onboarding Card and Week Bar */}
          <div className="lg:hidden px-4 mt-4 flex flex-col items-center gap-4">
            {/* Onboarding Video Card */}
            <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-md" style={{ border: '0.5px solid black' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2d2e2e' }}>
                Go onboarding in 2 minutes
              </h3>
              <p className="text-xs mb-3" style={{ color: '#666' }}>
                Verstehe das Spiel! Schau dir das kurze Onboarding Video an fuer mehr Disziplin, Fokus & Fantasie.
              </p>
              <Link
                href="/onboarding-video"
                className="inline-block bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-900 transition-all hover:scale-105 shadow-md text-sm w-full text-center"
              >
                Welcome to PAPYR
              </Link>
            </div>

            {/* Week Bar */}
            <div className="w-full max-w-md">
              <div className="bg-white shadow-lg rounded-xl p-3" style={{ border: '0.5px solid black' }}>
                <div className="flex gap-2">
                  {(() => {
                    const today = new Date();
                    const currentDay = today.getDay();
                    const monday = new Date(today);
                    const diff = currentDay === 0 ? -6 : 1 - currentDay;
                    monday.setDate(today.getDate() + diff);

                    const commitmentDates = new Set(
                      commitments
                        .filter(c => !c.is_developing)
                        .map(c => c.date)
                    );

                    const weekDays = ['M', 'D', 'M', 'D', 'F', 'S', 'S', 'M', 'D'];
                    const cells = [];

                    for (let i = 0; i < weekDaysToShow; i++) {
                      const date = new Date(monday);
                      date.setDate(monday.getDate() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const isToday = dateStr === today.toISOString().split('T')[0];
                      const hasCommitment = commitmentDates.has(dateStr);
                      const dayNumber = date.getDate();

                      cells.push(
                        <div
                          key={i}
                          className={`flex flex-col items-center justify-center w-10 h-12 rounded-lg border-2 ${
                            isToday ? 'text-white font-bold' : ''
                          }`}
                          style={isToday
                            ? { backgroundColor: '#2d2e2e', borderColor: '#2d2e2e' }
                            : { borderColor: '#e0e0e0', color: '#2d2e2e' }}
                        >
                          <div className="text-[10px] font-bold">{weekDays[i]}</div>
                          <div className="text-sm">{dayNumber}</div>
                          {hasCommitment && !isToday && (
                            <div className="text-[10px]">⭐</div>
                          )}
                          {isToday && (
                            <div className="text-[10px]">🔥</div>
                          )}
                        </div>
                      );
                    }

                    return cells;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Center content area */}
          <div className="flex-1 flex flex-col items-center pt-32 px-4 relative">
            <div className="text-center max-w-6xl mx-auto">
              {/* Streak Display for when Wolf Hour is not active */}
              {!isWithinWolfHour() && (
                <div className="mb-4">
                  <div className="flex justify-center mb-3">
                    <div className="bg-white px-8 py-4 rounded-2xl font-bold text-4xl md:text-5xl border-2 shadow-lg" style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}>
                      🔥 {currentStreak}
                    </div>
                  </div>
                  <p className="text-sm md:text-base italic" style={{ color: '#2d2e2e', opacity: 0.6 }}>
                    So viele Tage hast du durchgezogen
                  </p>
                </div>
              )}

              {canCommit && (
                <>
                  <h1 className="text-2xl md:text-4xl font-bold mb-1 mt-8" style={{ color: '#2d2e2e' }}>
                    Willkommen bei PAPYR.
                  </h1>
                  <p className="text-xl md:text-2xl mb-4 mt-12" style={{ color: '#2d2e2e' }}>
                    Dein Zettel fehlt.
                  </p>
                </>
              )}
              <h2 className="text-xl md:text-3xl font-bold mb-2 mt-8" style={{ color: '#2d2e2e' }}>
                Schmiede Pläne..
              </h2>
              <p className="text-base md:text-lg mb-4" style={{ color: '#2d2e2e' }}>
                Jeden Abend. Auf Papier. Schaffe dir Ziele.
              </p>
            </div>

            {/* Spacer to push button down */}
            <div className="flex-1"></div>

            {/* Upload Button - Fixed at bottom */}
            <div className="mb-8">
              <button
                onClick={handleCameraClick}
                disabled={uploading}
                className="bg-transparent px-12 py-4 text-xl md:text-2xl font-bold hover:shadow-xl transition-all hover:scale-105 rounded-xl inline-flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: '5px solid #4a4a4a', color: '#2d2e2e' }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="#2d2e2e"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {uploading ? 'Lädt...' : "Mach' deinen commit."}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                {...(uploadType === 'camera' ? { capture: 'environment' } : {})}
                onChange={handleFileChange}
                className="hidden"
              />

              {!isWithinWolfHour() && (
                <p className="text-sm mt-4 text-center" style={{ color: '#2d2e2e', opacity: 0.7 }}>
                  ⏰ Die Stunde des Wolfs: 20:00 - 02:00 Uhr
                </p>
              )}
            </div>
          </div>

          {/* Countdown to next upload window - Below button */}
          <div className="mb-12 flex justify-center w-full">
            <div className="bg-white rounded-2xl shadow-lg border-2 px-8 py-3" style={{ borderColor: '#e0e0e0' }}>
              <p className="text-sm font-bold mb-2 text-center" style={{ color: '#666' }}>
                Nächstes Upload-Fenster in:
              </p>
              <p className="text-4xl md:text-5xl font-bold text-center font-mono" style={{ color: '#2d2e2e' }}>
                {formatCountdown(countdown.hours, countdown.minutes, countdown.seconds)}
              </p>
            </div>
          </div>

          {/* Scroll Down Arrow - Bottom Right */}
          <div className="absolute bottom-20 right-[19.5rem] flex flex-col items-center gap-2 animate-bounce">
            <p className="font-bold text-lg transform rotate-12" style={{ color: '#2d2e2e' }}>
              Zum Archiv
            </p>
            <svg
              className="w-16 h-16 transform rotate-12"
              fill="none"
              stroke="#2d2e2e"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5 L12 19 M12 19 L5 12 M12 19 L19 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Commitments Preview - Below block image */}
      {recentCommitments.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12 relative">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>
            Deine letzten Bekenntnisse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCommitments.map((commitment) => (
              <div key={commitment.id} className="border-2 rounded-xl bg-white p-4 shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: '#e0e0e0' }}>
                <div className="relative">
                  <img
                    src={commitment.image_url}
                    alt={`Bekenntnis ${commitment.date}`}
                    className="w-full aspect-square object-cover mb-3"
                  />
                  {commitment.signature_initials && (
                    <div className="absolute bottom-3 right-0 bg-white/95 px-3 py-1 text-sm font-bold border-2 rounded shadow-md" style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}>
                      {commitment.signature_initials}
                    </div>
                  )}
                  {commitment.completed && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 text-sm font-bold rounded shadow-md">
                      ✓ Erledigt
                    </div>
                  )}
                </div>
                <div className="text-sm space-y-1" style={{ color: '#666' }}>
                  <p className="font-bold" style={{ color: '#2d2e2e' }}>{commitment.date}</p>
                  <p className="whitespace-pre-line line-clamp-2">{commitment.goals}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 space-y-2">
                  {canMarkAsCompleted(commitment.date) && !commitment.completed && (
                    <button
                      onClick={() => handleMarkCompleted(commitment.id)}
                      className="w-full bg-green-500 text-white px-3 py-2 text-sm font-bold hover:bg-green-600 transition-colors rounded-lg shadow-sm"
                    >
                      ✓ Als erledigt markieren
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(commitment.id)}
                    className="w-full bg-red-500 text-white px-3 py-2 text-sm font-bold hover:bg-red-600 transition-colors rounded-lg shadow-sm"
                  >
                    🗑 Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {commitments.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12 relative">
          <div className="text-center py-12 border-2 rounded-2xl bg-white shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <p className="text-xl mb-4" style={{ color: '#666' }}>
              Dein Archiv wartet auf dein erstes Bekenntnis.
            </p>
            <p className="text-sm" style={{ color: '#999' }}>
              Komm zwischen 20:00 und 02:00 Uhr zurück.
            </p>
          </div>
        </div>
      )}

      {/* Upload Choice Dialog */}
      <ConfirmDialog
        title="Zettel scannen"
        message="Woher möchtest du dein Foto nehmen?"
        isOpen={showUploadChoice}
        onClose={() => setShowUploadChoice(false)}
        buttons={[
          {
            text: 'Kamera öffnen',
            action: () => handleUploadChoice('camera'),
            primary: true,
          },
          {
            text: 'Galerie durchsuchen',
            action: () => handleUploadChoice('gallery'),
          },
        ]}
      />

      {/* Auth Modal for login */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            window.location.reload();
          }}
        />
      )}

      {/* Add to Home Screen Prompt */}
      <AddToHomeScreen />

      {/* Goals Input Popup */}
      <GoalsInputPopup
        isOpen={showGoalsPopup}
        imageUrl={uploadedImageUrl}
        onSubmit={handleGoalsSubmit}
        onClose={() => {
          setShowGoalsPopup(false);
          if (uploadedImageUrl) {
            URL.revokeObjectURL(uploadedImageUrl);
          }
          setUploadedFile(null);
          setUploadedImageUrl('');
        }}
      />
    </div>
  );
}
