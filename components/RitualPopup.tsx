'use client';

import { useState, useEffect } from 'react';

interface RitualPopupProps {
  isOpen: boolean;
  onClose: () => void;
  inspirationText: string;
}

export default function RitualPopup({ isOpen, onClose, inspirationText }: RitualPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        show ? 'backdrop-blur-md' : ''
      }`}
      onClick={handleClose}
      style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.92)' : 'rgba(0, 0, 0, 0)' }}
    >
      <div
        className={`w-full bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ border: '0.5px solid black', maxWidth: '920px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 border-b-2" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-1">
            Das Ritual
          </h2>
          <p className="text-sm md:text-base text-white/80 text-center">
            Dein Weg zu Struktur, Disziplin und Fokus
          </p>
        </div>

        {/* Content */}
        <div className="p-6" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          {/* Inspiration Text */}
          <div className="bg-white border-2 rounded-xl p-4 mb-4 shadow-md" style={{ borderColor: '#e0e0e0' }}>
            <p className="text-lg md:text-xl font-bold text-center leading-relaxed" style={{ color: '#2d2e2e' }}>
              "{inspirationText}"
            </p>
          </div>

          {/* Ritual Steps */}
          <div className="space-y-3">
            <div className="bg-white border-2 rounded-xl p-4 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-0.5" style={{ color: '#2d2e2e' }}>
                    Nimm einen Zettel und Stift
                  </h3>
                  <p className="text-sm" style={{ color: '#666' }}>
                    Papier ist persönlich. Papier ist beständig. Das Schreiben mit der Hand verbindet dich mit deinem Ziel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 rounded-xl p-4 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-0.5" style={{ color: '#2d2e2e' }}>
                    Schreibe diese Idee auf
                  </h3>
                  <p className="text-sm" style={{ color: '#666' }}>
                    Übertrage diese Inspiration auf deinen Zettel für morgen. Mache sie zu deinem eigenen Ziel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 rounded-xl p-4 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-0.5" style={{ color: '#2d2e2e' }}>
                    Gib dir Struktur
                  </h3>
                  <p className="text-sm" style={{ color: '#666' }}>
                    Das Ritual gibt dir Disziplin und Fokus. Jeden Abend. Jeden Tag ein neues Ziel. So schaffst du Struktur in deinem Leben.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 rounded-xl p-4 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-0.5" style={{ color: '#2d2e2e' }}>
                    Tue anderen Gutes
                  </h3>
                  <p className="text-sm" style={{ color: '#666' }}>
                    Deine Disziplin inspiriert andere. Deine Erfolge zeigen anderen den Weg. So tust du nicht nur dir selbst, sondern auch anderen Gutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-4 text-center">
            <p className="text-sm italic" style={{ color: '#666' }}>
              "Disziplin ist die Brücke zwischen Zielen und Erfolg."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          <button
            onClick={handleClose}
            className="w-full bg-black text-white px-6 py-3 text-base font-bold hover:bg-gray-900 transition-all hover:scale-105 shadow-md rounded-xl"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
