'use client';

import { useState } from 'react';
import { getAppState } from '@/lib/storage';

export default function Archive() {
  const appState = getAppState();
  const [filter, setFilter] = useState<'all' | 'developed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const commitments = filter === 'all'
    ? appState.commitments
    : appState.commitments.filter(c => !c.isDeveloping);

  const visibleCommitments = appState.hasPaid
    ? commitments
    : commitments.slice(0, 7);

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            Dein Archiv
          </h1>
          <p className="text-lg text-brown/70">
            {appState.commitments.length} {appState.commitments.length === 1 ? 'Bekenntnis' : 'Bekenntnisse'} gesiegelt
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-bold border-4 transition-colors ${
                filter === 'all'
                  ? 'bg-brown text-cream border-brown'
                  : 'bg-white text-brown border-brown hover:bg-vintage/30'
              }`}
            >
              Alle ({appState.commitments.length})
            </button>
            <button
              onClick={() => setFilter('developed')}
              className={`px-6 py-3 font-bold border-4 transition-colors ${
                filter === 'developed'
                  ? 'bg-brown text-cream border-brown'
                  : 'bg-white text-brown border-brown hover:bg-vintage/30'
              }`}
            >
              Entwickelt ({appState.commitments.filter(c => !c.isDeveloping).length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 border-4 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brown text-cream border-brown'
                  : 'bg-white text-brown border-brown hover:bg-vintage/30'
              }`}
              title="Grid View"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 border-4 transition-colors ${
                viewMode === 'list'
                  ? 'bg-brown text-cream border-brown'
                  : 'bg-white text-brown border-brown hover:bg-vintage/30'
              }`}
              title="List View"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleCommitments.map((commitment) => (
              <div key={commitment.id} className="relative">
                <div className="border-8 border-brown bg-white p-3 shadow-xl hover:shadow-2xl transition-shadow">
                  {commitment.isDeveloping ? (
                    <div className="aspect-square bg-white flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-brown/50 text-sm font-bold animate-pulse">
                          Entwickelt sich...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <img
                          src={commitment.imageData}
                          alt={`Bekenntnis ${commitment.date}`}
                          className="w-full aspect-square object-cover mb-2"
                        />
                        {commitment.signatureInitials && (
                          <div className="absolute bottom-2 right-2 bg-brown/90 text-cream px-2 py-1 text-xs font-bold border-2 border-cream">
                            {commitment.signatureInitials}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-brown/70 space-y-1">
                        <p className="font-bold">{commitment.date}</p>
                        <p className="whitespace-pre-line line-clamp-3">{commitment.goals}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {visibleCommitments.map((commitment) => (
              <div key={commitment.id} className="border-4 border-brown bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 flex-shrink-0">
                    {commitment.isDeveloping ? (
                      <div className="aspect-square bg-vintage/20 flex items-center justify-center border-2 border-brown/20">
                        <p className="text-brown/50 text-sm font-bold animate-pulse">
                          Entwickelt sich...
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={commitment.imageData}
                          alt={`Bekenntnis ${commitment.date}`}
                          className="w-full aspect-square object-cover border-2 border-brown/20"
                        />
                        {commitment.signatureInitials && (
                          <div className="absolute bottom-2 right-2 bg-brown/90 text-cream px-2 py-1 text-xs font-bold border-2 border-cream">
                            {commitment.signatureInitials}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-sm font-bold text-brown/60">Datum:</span>
                      <span className="ml-2 text-lg font-bold text-brown">{commitment.date}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-brown/60 block mb-2">Ziele:</span>
                      <p className="text-lg text-brown whitespace-pre-line">{commitment.goals}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paywall Notice */}
        {!appState.hasPaid && appState.commitments.length > 7 && (
          <div className="mt-8 text-center border-4 border-brown/30 p-8 bg-vintage/20">
            <p className="text-xl text-brown/70 italic mb-4">
              Dein Archiv ist verblasst...<br />
              {appState.commitments.length - 7} Bekenntnisse sind nicht mehr sichtbar.
            </p>
            <p className="text-lg text-brown font-bold">
              Bekenne dich für 1 €/Monat, um alles zu bewahren.
            </p>
          </div>
        )}

        {/* Empty State */}
        {commitments.length === 0 && (
          <div className="text-center py-20 border-4 border-brown/30 bg-white/50">
            <p className="text-2xl text-brown/70">
              Noch keine Bekenntnisse vorhanden.
            </p>
            <p className="text-sm text-brown/50 mt-4">
              Komm zwischen 20:00 und 02:00 Uhr zurück.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
