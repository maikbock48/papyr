'use client';

import { useState, useRef } from 'react';
import { getAppState, isWithinWolfHour, canCommitToday, needsPaywall, deleteCommitment, markCommitmentCompleted } from '@/lib/storage';
import ConfirmDialog from './ConfirmDialog';

interface DashboardProps {
  onUpload: () => void;
  onPaywallRequired: () => void;
  globalPulse: number;
}

export default function Dashboard({ onUpload, onPaywallRequired, globalPulse }: DashboardProps) {
  const [appState, setAppState] = useState(getAppState());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadChoice, setShowUploadChoice] = useState(false);
  const [uploadType, setUploadType] = useState<'camera' | 'gallery'>('camera');

  const handleCameraClick = () => {
    if (needsPaywall()) {
      onPaywallRequired();
      return;
    }

    if (!isWithinWolfHour()) {
      alert('⏰ Die Stunde des Wolfs ist zwischen 20:00 und 02:00 Uhr. Komm dann wieder.');
      return;
    }

    if (!canCommitToday()) {
      alert('✅ Du hast heute bereits dein Bekenntnis abgelegt. Bis morgen Abend!');
      return;
    }

    // Show choice dialog
    setShowUploadChoice(true);
  };

  const handleUploadChoice = (type: 'camera' | 'gallery') => {
    setUploadType(type);
    setShowUploadChoice(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchtest du diesen Zettel wirklich löschen? Das kann nicht rückgängig gemacht werden!')) {
      deleteCommitment(id);
      setAppState(getAppState());
    }
  };

  const handleMarkCompleted = (id: string) => {
    markCommitmentCompleted(id);
    setAppState(getAppState());
  };

  const canMarkAsCompleted = (commitmentDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const commitDate = new Date(commitmentDate);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 1; // Can mark as completed from the next day onwards
  };

  // Latest 3 commitments for preview
  const recentCommitments = appState.commitments
    .filter(c => !c.isDeveloping)
    .slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
      {/* Block Image Section - 100vh, doesn't scroll */}
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src="/last.png"
          alt="PAPYR Block"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-auto h-full object-contain"
        />

        {/* Hero Section - Overlay on top of block */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Headline - Top */}
          <div className="pt-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold" style={{ color: '#2d2e2e', marginBottom: '12px' }}>
              Was steht an?
            </h1>
            {!canCommitToday() && (
              <p className="text-xl md:text-2xl" style={{ color: '#2d2e2e' }}>
                Dein Zettel ist Zettel {globalPulse.toLocaleString()}.
              </p>
            )}
          </div>

          {/* Calendar - positioned in top right - Desktop only */}
          <div className="relative hidden lg:block">
            <div className="text-center">
              <div className="absolute right-[2%] md:right-[6%] transform rotate-[3deg] scale-110" style={{ marginTop: '180px' }}>
                  <div className="bg-white border-2 shadow-lg rounded-xl p-4 min-w-[200px]" style={{ borderColor: '#e0e0e0' }}>
                    {/* Calendar Header */}
                    <div className="text-center mb-2 pb-2 border-b" style={{ borderColor: '#e0e0e0' }}>
                      <p className="text-sm font-bold" style={{ color: '#2d2e2e' }}>
                        {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {(() => {
                        const today = new Date();
                        const currentMonth = today.getMonth();
                        const currentYear = today.getFullYear();
                        const firstDay = new Date(currentYear, currentMonth, 1);
                        const lastDay = new Date(currentYear, currentMonth + 1, 0);
                        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                        const daysInMonth = lastDay.getDate();

                        // Get commitment dates
                        const commitmentDates = new Set(
                          appState.commitments
                            .filter(c => !c.isDeveloping)
                            .map(c => c.date)
                        );

                        const cells = [];

                        // Weekday headers
                        ['M', 'D', 'M', 'D', 'F', 'S', 'S'].forEach((day, i) => {
                          cells.push(
                            <div key={`header-${i}`} className="text-xs font-bold text-center" style={{ color: 'rgba(45, 46, 46, 0.6)' }}>
                              {day}
                            </div>
                          );
                        });

                        // Empty cells before first day
                        for (let i = 0; i < startDay; i++) {
                          cells.push(<div key={`empty-${i}`} />);
                        }

                        // Days of the month
                        for (let day = 1; day <= daysInMonth; day++) {
                          const date = new Date(currentYear, currentMonth, day);
                          const dateStr = date.toISOString().split('T')[0];
                          const isToday = day === today.getDate();
                          const hasCommitment = commitmentDates.has(dateStr);

                          cells.push(
                            <div
                              key={`day-${day}`}
                              className={`text-xs text-center p-1 relative ${
                                isToday
                                  ? 'text-cream font-bold rounded border-2'
                                  : ''
                              }`}
                              style={isToday
                                ? { backgroundColor: '#2d2e2e', borderColor: '#2d2e2e' }
                                : { color: 'rgba(45, 46, 46, 0.7)' }}
                            >
                              {isToday ? (
                                <div className="flex flex-col items-center">
                                  <div className="text-[10px] leading-none">{day}</div>
                                  <div className="text-[8px] leading-none mt-0.5">🔥{appState.currentStreak}</div>
                                </div>
                              ) : (
                                <>
                                  {day}
                                  {hasCommitment && (
                                    <div className="absolute -top-0.5 -right-0.5 text-[10px]">⭐</div>
                                  )}
                                </>
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
            </div>

          {/* Week Bar - Mobile/Tablet only */}
          <div className="lg:hidden px-4 mt-8">
            <div className="flex justify-center">
              <div className="bg-white border-2 shadow-lg rounded-xl p-3" style={{ borderColor: '#e0e0e0' }}>
                <div className="flex gap-2">
                  {(() => {
                    const today = new Date();
                    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
                    const monday = new Date(today);
                    // Get Monday of current week
                    const diff = currentDay === 0 ? -6 : 1 - currentDay;
                    monday.setDate(today.getDate() + diff);

                    // Get commitment dates
                    const commitmentDates = new Set(
                      appState.commitments
                        .filter(c => !c.isDeveloping)
                        .map(c => c.date)
                    );

                    const weekDays = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];
                    const cells = [];

                    for (let i = 0; i < 7; i++) {
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
          <div className="flex-1 flex flex-col items-center pt-28 px-4 relative">
            <div className="text-center max-w-6xl mx-auto">
              {/* Streak Display for when Wolf Hour is not active */}
              {!isWithinWolfHour() && (
                <div className="mb-4">
                  <div className="flex justify-center mb-3">
                    <div className="bg-white px-8 py-4 rounded-2xl font-bold text-4xl md:text-5xl border-2 shadow-lg" style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}>
                      🔥 {appState.currentStreak}
                    </div>
                  </div>
                  <p className="text-sm md:text-base italic" style={{ color: '#2d2e2e', opacity: 0.6 }}>
                    So viele Tage hast du durchgezogen
                  </p>
                </div>
              )}

              {canCommitToday() && (
                <p className="text-xl md:text-2xl mb-4" style={{ color: '#2d2e2e' }}>
                  Dein Zettel fehlt.
                </p>
              )}
              <h2 className="text-xl md:text-3xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                Schmiede Pläne..
              </h2>
              <p className="text-base md:text-lg mb-8" style={{ color: '#2d2e2e' }}>
                Jeden Abend. Auf Papier. Dann hier siegeln.
              </p>
            </div>

            {/* Upload Button - Fixed at bottom */}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2">
              <button
                onClick={handleCameraClick}
                className="bg-transparent px-12 py-4 text-xl md:text-2xl font-bold hover:shadow-xl transition-all hover:scale-105 rounded-xl inline-flex items-center gap-4"
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
                Zettel scannen
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

          {/* Scroll Down Arrow - Bottom Right */}
          <div className="absolute bottom-20 right-24 flex flex-col items-center gap-2 animate-bounce">
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
        <div className="max-w-6xl mx-auto px-4 py-12 relative" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#2d2e2e' }}>
            Deine letzten Bekenntnisse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCommitments.map((commitment) => (
              <div key={commitment.id} className="border-2 rounded-xl bg-white p-4 shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: '#e0e0e0' }}>
                <div className="relative">
                  <img
                    src={commitment.imageData}
                    alt={`Bekenntnis ${commitment.date}`}
                    className="w-full aspect-square object-cover mb-3"
                  />
                  {commitment.signatureInitials && (
                    <div className="absolute bottom-3 right-0 bg-white/95 px-3 py-1 text-sm font-bold border-2 rounded shadow-md" style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}>
                      {commitment.signatureInitials}
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
      {appState.commitments.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12 relative" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
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
            text: '📷 Kamera öffnen',
            action: () => handleUploadChoice('camera'),
            primary: true,
          },
          {
            text: '🖼 Galerie durchsuchen',
            action: () => handleUploadChoice('gallery'),
          },
        ]}
      />
    </div>
  );
}
