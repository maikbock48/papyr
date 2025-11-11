'use client';

import Link from 'next/link';

export default function OnboardingVideo() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
      {/* Header with back button */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/"
          className="text-white hover:text-gray-300 transition-colors text-xl font-bold flex items-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">
          🎬 Onboarding
        </h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: '#2d2e2e' }}>
            Willkommen bei PAPYR
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#666' }}>
            Entdecke, wie PAPYR dir hilft, deine Ziele täglich zu erreichen und deine Produktivität zu maximieren.
          </p>
        </div>

        {/* Video Container */}
        <div className="bg-white border-2 rounded-xl p-4 md:p-8 shadow-2xl mb-8" style={{ borderColor: '#e0e0e0' }}>
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 border-2 rounded-xl flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)'
              }}></div>
            </div>

            {/* Placeholder content */}
            <div className="text-center relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border-4 border-white/20">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white mb-2">
                Onboarding Video
              </p>
              <p className="text-sm md:text-base text-white/70">
                Video wird hier eingebettet (YouTube, Vimeo, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: '#e0e0e0' }}>
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
              Täglich Commitments
            </h3>
            <p style={{ color: '#666' }}>
              Schreibe jeden Abend deine Ziele auf und halte deine Versprechen ein.
            </p>
          </div>

          <div className="bg-white border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: '#e0e0e0' }}>
            <div className="text-4xl mb-3">🔥</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
              Streaks aufbauen
            </h3>
            <p style={{ color: '#666' }}>
              Baue täglich an deiner Streak und erreiche Meilensteine.
            </p>
          </div>

          <div className="bg-white border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: '#e0e0e0' }}>
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
              Archiv aufbauen
            </h3>
            <p style={{ color: '#666' }}>
              Dokumentiere deinen Fortschritt und schaue zurück auf deine Erfolge.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white border-2 rounded-xl p-8 md:p-12 text-center shadow-2xl" style={{ borderColor: '#e0e0e0' }}>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Bereit loszulegen?
          </h3>
          <p className="text-lg mb-6 text-white/80">
            Starte noch heute mit deinem ersten Commitment während der Stunde des Wolfs (20:00 - 02:00 Uhr).
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-black px-8 py-4 text-lg font-bold hover:bg-gray-100 transition-colors rounded-xl shadow-lg"
          >
            Zum Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
