'use client';

import { useState } from 'react';
import { getAppState } from '@/lib/storage';

interface NavbarProps {
  currentView: 'dashboard' | 'archive' | 'settings';
  onNavigate: (view: 'dashboard' | 'archive' | 'settings') => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const appState = getAppState();

  return (
    <nav className="bg-brown border-b-4 border-brown shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-2xl md:text-3xl font-bold text-cream tracking-wider hover:text-vintage transition-colors"
            >
              P A P Y R
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-lg font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'text-cream border-b-2 border-cream'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('archive')}
              className={`text-lg font-medium transition-colors ${
                currentView === 'archive'
                  ? 'text-cream border-b-2 border-cream'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              Archiv
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`text-lg font-medium transition-colors ${
                currentView === 'settings'
                  ? 'text-cream border-b-2 border-cream'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              Einstellungen
            </button>
          </div>

          {/* User Info & Streak */}
          <div className="hidden md:flex items-center space-x-6">
            {appState.userName && (
              <div className="text-cream/80 text-sm">
                {appState.userName}
              </div>
            )}
            <div className="bg-cream text-brown px-4 py-2 rounded-full font-bold text-xl border-2 border-cream">
              🔥 {appState.currentStreak}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="bg-cream text-brown px-3 py-1 rounded-full font-bold text-sm">
              🔥 {appState.currentStreak}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-cream hover:text-vintage transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brown border-t-2 border-cream/20">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {appState.userName && (
              <div className="text-cream/60 text-sm pb-2 border-b border-cream/20">
                Hallo, {appState.userName}
              </div>
            )}
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentView === 'dashboard'
                  ? 'bg-cream text-brown'
                  : 'text-cream hover:bg-brown/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                onNavigate('archive');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentView === 'archive'
                  ? 'bg-cream text-brown'
                  : 'text-cream hover:bg-brown/50'
              }`}
            >
              Archiv
            </button>
            <button
              onClick={() => {
                onNavigate('settings');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentView === 'settings'
                  ? 'bg-cream text-brown'
                  : 'text-cream hover:bg-brown/50'
              }`}
            >
              Einstellungen
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
