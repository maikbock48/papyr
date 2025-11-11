'use client';

import { useState, useEffect } from 'react';

export default function AddToHomeScreen() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    // Check if already dismissed
    const dismissed = localStorage.getItem('addToHomeScreenDismissed');

    if (checkMobile && !dismissed) {
      // Show after 3 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('addToHomeScreenDismissed', 'true');
  };

  if (!showPrompt || !isMobile) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
      <div className="bg-white border-2 rounded-xl p-4 shadow-2xl max-w-md mx-auto" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">📱</div>
          <div className="flex-1">
            <h3 className="text-base font-bold mb-1" style={{ color: '#2d2e2e' }}>
              Add PAPYR to your home screen
            </h3>
            <p className="text-xs mb-3" style={{ color: '#666' }}>
              Für schnellen Zugriff füge PAPYR zu deinem Startbildschirm hinzu.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-2xl text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
