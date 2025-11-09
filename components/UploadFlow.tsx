'use client';

import { useState } from 'react';

interface UploadFlowProps {
  imageData: string;
  onSubmit: (goals: string) => void;
  onCancel: () => void;
}

export default function UploadFlow({ imageData, onSubmit, onCancel }: UploadFlowProps) {
  const [goals, setGoals] = useState('');

  const handleSubmit = () => {
    if (!goals.trim()) {
      alert('⚠️ Bitte tippe deine Ziele ab.');
      return;
    }

    const goalLines = goals.split('\n').filter(g => g.trim());
    if (goalLines.length > 2) {
      alert('⚠️ Maximal 2 Ziele. Fokussiere dich!');
      return;
    }

    onSubmit(goals);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brown mb-8 text-center">
          Dein Bekenntnis
        </h2>

        <div className="space-y-8">
          {/* Image Preview */}
          <div className="border-8 border-brown bg-white p-4 shadow-2xl">
            <img
              src={imageData}
              alt="Dein Zettel"
              className="w-full"
            />
          </div>

          {/* Goals Input */}
          <div>
            <label className="block text-xl md:text-2xl font-bold text-brown mb-4">
              Tippe deine 1-2 Ziele ab:
            </label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Ziel 1&#10;Ziel 2"
              rows={4}
              className="w-full border-4 border-brown p-6 text-lg md:text-xl bg-white focus:outline-none focus:ring-4 focus:ring-brown/50 font-typewriter"
              autoFocus
            />
            <p className="text-sm text-brown/70 mt-3">
              Jede Zeile = ein Ziel. Maximal 2. Das ist der Fokus.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={!goals.trim()}
              className="w-full bg-brown text-cream px-8 py-6 text-xl md:text-2xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bekenntnis siegeln
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-cream text-brown px-8 py-4 text-lg border-4 border-brown hover:bg-vintage/30 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
