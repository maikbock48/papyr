'use client';

import { useState } from 'react';
import { getAppState, deleteCommitment, markCommitmentCompleted } from '@/lib/storage';
import { downloadCommitmentEvent } from '@/lib/calendar';

export default function Archive() {
  const [appState, setAppState] = useState(getAppState());
  const [filter, setFilter] = useState<'all' | 'developed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const handleExportToCalendar = (commitment: any) => {
    const date = new Date(commitment.timestamp);
    downloadCommitmentEvent(date, commitment.goals);
  };

  const canMarkAsCompleted = (commitmentDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const commitDate = new Date(commitmentDate);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 1; // Can mark as completed from the next day onwards
  };

  const commitments = filter === 'all'
    ? appState.commitments
    : appState.commitments.filter(c => !c.isDeveloping);

  const visibleCommitments = appState.hasPaid
    ? commitments
    : commitments.slice(0, 7);

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2d2e2e' }}>
            Dein Archiv
          </h1>
          <p className="text-lg" style={{ color: '#666' }}>
            {appState.commitments.length} {appState.commitments.length === 1 ? 'Bekenntnis' : 'Bekenntnisse'} gesiegelt
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-bold border-2 rounded-lg transition-colors shadow-sm ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={filter === 'all' ? {} : { color: '#2d2e2e', borderColor: '#e0e0e0' }}
            >
              Alle ({appState.commitments.length})
            </button>
            <button
              onClick={() => setFilter('developed')}
              className={`px-6 py-3 font-bold border-2 rounded-lg transition-colors shadow-sm ${
                filter === 'developed'
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={filter === 'developed' ? {} : { color: '#2d2e2e', borderColor: '#e0e0e0' }}
            >
              Entwickelt ({appState.commitments.filter(c => !c.isDeveloping).length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 border-2 rounded-lg transition-colors shadow-sm ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={viewMode === 'grid' ? {} : { borderColor: '#e0e0e0' }}
              title="Grid View"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 border-2 rounded-lg transition-colors shadow-sm ${
                viewMode === 'list'
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={viewMode === 'list' ? {} : { borderColor: '#e0e0e0' }}
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
                <div className="border-2 rounded-xl bg-white p-3 shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: '#e0e0e0' }}>
                  {commitment.isDeveloping ? (
                    <div className="aspect-square bg-white flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm font-bold animate-pulse" style={{ color: '#999' }}>
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
                          className="w-full aspect-square object-cover mb-2 rounded"
                        />
                        {commitment.signatureInitials && (
                          <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-1 text-xs font-bold border-2 rounded shadow-md" style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}>
                            {commitment.signatureInitials}
                          </div>
                        )}
                        {commitment.completed && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded shadow-md">
                            ✓ Erledigt
                          </div>
                        )}
                      </div>
                      <div className="text-xs space-y-1 mb-2" style={{ color: '#666' }}>
                        <p className="font-bold">{commitment.date}</p>
                        <p className="whitespace-pre-line line-clamp-3">{commitment.goals}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-1">
                        {canMarkAsCompleted(commitment.date) && !commitment.completed && (
                          <button
                            onClick={() => handleMarkCompleted(commitment.id)}
                            className="w-full bg-green-500 text-white px-2 py-1 text-xs font-bold hover:bg-green-600 transition-colors rounded shadow-sm"
                          >
                            ✓ Erledigt
                          </button>
                        )}
                        <button
                          onClick={() => handleExportToCalendar(commitment)}
                          className="w-full bg-blue-500 text-white px-2 py-1 text-xs font-bold hover:bg-blue-600 transition-colors rounded shadow-sm"
                        >
                          📅
                        </button>
                        <button
                          onClick={() => handleDelete(commitment.id)}
                          className="w-full bg-red-500 text-white px-2 py-1 text-xs font-bold hover:bg-red-600 transition-colors rounded shadow-sm"
                        >
                          🗑
                        </button>
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
              <div key={commitment.id} className="border-2 rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ borderColor: '#e0e0e0' }}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 flex-shrink-0">
                    {commitment.isDeveloping ? (
                      <div className="aspect-square bg-gray-50 flex items-center justify-center border-2 rounded" style={{ borderColor: '#e0e0e0' }}>
                        <p className="text-sm font-bold animate-pulse" style={{ color: '#999' }}>
                          Entwickelt sich...
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={commitment.imageData}
                          alt={`Bekenntnis ${commitment.date}`}
                          className="w-full aspect-square object-cover border-2 rounded" style={{ borderColor: '#e0e0e0' }}
                        />
                        {commitment.signatureInitials && (
                          <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-1 text-xs font-bold border-2 rounded shadow-md" style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}>
                            {commitment.signatureInitials}
                          </div>
                        )}
                        {commitment.completed && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded shadow-md">
                            ✓ Erledigt
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-sm font-bold" style={{ color: '#999' }}>Datum:</span>
                      <span className="ml-2 text-lg font-bold" style={{ color: '#2d2e2e' }}>{commitment.date}</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm font-bold block mb-2" style={{ color: '#999' }}>Ziele:</span>
                      <p className="text-lg whitespace-pre-line" style={{ color: '#2d2e2e' }}>{commitment.goals}</p>
                    </div>

                    {/* Action Buttons */}
                    {!commitment.isDeveloping && (
                      <div className="flex gap-2">
                        {canMarkAsCompleted(commitment.date) && !commitment.completed && (
                          <button
                            onClick={() => handleMarkCompleted(commitment.id)}
                            className="bg-green-500 text-white px-4 py-2 text-sm font-bold hover:bg-green-600 transition-colors rounded-lg shadow-sm"
                          >
                            ✓ Als erledigt markieren
                          </button>
                        )}
                        <button
                          onClick={() => handleExportToCalendar(commitment)}
                          className="bg-blue-500 text-white px-4 py-2 text-sm font-bold hover:bg-blue-600 transition-colors rounded-lg shadow-sm"
                        >
                          📅 Zu Kalender
                        </button>
                        <button
                          onClick={() => handleDelete(commitment.id)}
                          className="bg-red-500 text-white px-4 py-2 text-sm font-bold hover:bg-red-600 transition-colors rounded-lg shadow-sm"
                        >
                          🗑 Löschen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paywall Notice */}
        {!appState.hasPaid && appState.commitments.length > 7 && (
          <div className="mt-8 text-center border-2 p-8 bg-white rounded-xl shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <p className="text-xl italic mb-4" style={{ color: '#666' }}>
              Dein Archiv ist verblasst...<br />
              {appState.commitments.length - 7} Bekenntnisse sind nicht mehr sichtbar.
            </p>
            <p className="text-lg font-bold" style={{ color: '#2d2e2e' }}>
              Bekenne dich für 1 €/Monat, um alles zu bewahren.
            </p>
          </div>
        )}

        {/* Empty State */}
        {commitments.length === 0 && (
          <div className="text-center py-20 border-2 bg-white rounded-xl shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <p className="text-2xl" style={{ color: '#666' }}>
              Noch keine Bekenntnisse vorhanden.
            </p>
            <p className="text-sm mt-4" style={{ color: '#999' }}>
              Komm zwischen 20:00 und 02:00 Uhr zurück.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
