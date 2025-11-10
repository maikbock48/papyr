'use client';

import { useState, useRef } from 'react';
import { getAppState, isWithinWolfHour, canCommitToday, needsPaywall, deleteCommitment, markCommitmentCompleted } from '@/lib/storage';

interface DashboardProps {
  onUpload: () => void;
  onPaywallRequired: () => void;
  globalPulse: number;
}

export default function Dashboard({ onUpload, onPaywallRequired, globalPulse }: DashboardProps) {
  const [appState, setAppState] = useState(getAppState());
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    fileInputRef.current?.click();
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
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-vintage/30 to-cream border-b-4 border-brown/20">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-8">
            {/* Global Counter */}
            {isWithinWolfHour() && (
              <div className="mb-8 animate-pulse">
                <p className="text-sm md:text-base text-brown/60 italic">
                  Heute wurden bereits
                </p>
                <p className="text-5xl md:text-6xl font-bold text-brown mt-2">
                  {globalPulse.toLocaleString()}
                </p>
                <p className="text-xl md:text-2xl text-brown/70 mt-2">
                  Zettel abgegeben
                </p>
              </div>
            )}

            {/* Streak Display */}
            <div className="mb-8">
              <p className="text-sm md:text-base text-brown/60 italic">
                So viele Tage hast du durchgezogen
              </p>
              <div className="flex justify-center mt-3">
                <div className="bg-cream text-brown px-8 py-4 rounded-full font-bold text-4xl md:text-5xl border-4 border-brown shadow-xl">
                  🔥 {appState.currentStreak}
                </div>
              </div>
            </div>

            {/* Paper & Pen Illustration Placeholder */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                {/* Paper */}
                <div className="bg-white border-4 border-brown shadow-2xl rounded-2xl p-8 md:p-12 transform -rotate-2">
                  <div className="space-y-4">
                    <div className="h-3 bg-brown/10 w-3/4"></div>
                    <div className="h-3 bg-brown/10 w-full"></div>
                    <div className="h-3 bg-brown/10 w-5/6"></div>
                    <div className="h-8"></div>
                    <div className="h-3 bg-brown/10 w-2/3"></div>
                    <div className="h-3 bg-brown/10 w-4/5"></div>
                  </div>
                </div>
                {/* Pen */}
                <div className="absolute -right-4 bottom-4 md:-right-8 md:bottom-8 transform rotate-45">
                  <div className="w-3 h-32 bg-brown rounded-full shadow-lg"></div>
                  <div className="w-3 h-8 bg-brown/70 rounded-t-full"></div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-brown mb-4">
              Schreibe dein Bekenntnis
            </h2>
            <p className="text-lg md:text-xl text-brown/70 mb-8">
              Jeden Abend. Auf Papier. Dann hier siegeln.
            </p>

            {/* Upload Button */}
            <button
              onClick={handleCameraClick}
              className="bg-brown text-cream px-12 py-6 text-xl md:text-2xl font-bold hover:bg-brown/90 transition-all hover:scale-105 border-4 border-brown shadow-xl rounded-lg inline-flex items-center gap-4"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
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
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {!isWithinWolfHour() && (
              <p className="text-sm text-brown/50 mt-4">
                ⏰ Die Stunde des Wolfs: 20:00 - 02:00 Uhr
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Commitments Preview */}
      {recentCommitments.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-brown mb-6">
            Deine letzten Bekenntnisse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCommitments.map((commitment) => (
              <div key={commitment.id} className="border-8 border-brown rounded-2xl bg-white p-4 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="relative">
                  <img
                    src={commitment.imageData}
                    alt={`Bekenntnis ${commitment.date}`}
                    className="w-full aspect-square object-cover mb-3"
                  />
                  {commitment.signatureInitials && (
                    <div className="absolute bottom-3 right-0 bg-brown/90 text-cream px-3 py-1 text-sm font-bold border-2 border-cream">
                      {commitment.signatureInitials}
                    </div>
                  )}
                  {commitment.completed && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 text-sm font-bold border-2 border-white">
                      ✓ Erledigt
                    </div>
                  )}
                </div>
                <div className="text-sm text-brown/70 space-y-1">
                  <p className="font-bold">{commitment.date}</p>
                  <p className="whitespace-pre-line line-clamp-2">{commitment.goals}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 space-y-2">
                  {canMarkAsCompleted(commitment.date) && !commitment.completed && (
                    <button
                      onClick={() => handleMarkCompleted(commitment.id)}
                      className="w-full bg-green-600 text-white px-3 py-2 text-sm font-bold hover:bg-green-700 transition-colors border-2 border-green-600 rounded-lg"
                    >
                      ✓ Als erledigt markieren
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(commitment.id)}
                    className="w-full bg-red-600 text-white px-3 py-2 text-sm font-bold hover:bg-red-700 transition-colors border-2 border-red-600 rounded-lg"
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
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-12 border-4 border-brown/30 rounded-2xl bg-white/50">
            <p className="text-xl text-brown/70 mb-4">
              Dein Archiv wartet auf dein erstes Bekenntnis.
            </p>
            <p className="text-sm text-brown/50">
              Komm zwischen 20:00 und 02:00 Uhr zurück.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
