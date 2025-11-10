'use client';

import { useState } from 'react';
import { getAppState } from '@/lib/storage';

interface NavbarProps {
  currentView: 'dashboard' | 'archive' | 'settings' | 'shop';
  onNavigate: (view: 'dashboard' | 'archive' | 'settings' | 'shop') => void;
  onOpenInspiration: () => void;
}

export default function Navbar({ currentView, onNavigate, onOpenInspiration }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const appState = getAppState();

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-brown border-b-4 border-brown shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:justify-center items-center h-16">
            {/* Desktop Toggle Button - Left */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block absolute left-6 text-cream hover:text-vintage transition-colors"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo - Centered */}
            <div className="flex items-center flex-1 md:flex-none justify-center">
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/assets/PAPYR.png"
                  alt="PAPYR Logo"
                  className="h-14 md:h-12 w-auto"
                />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2 absolute right-4">
              {appState.jokers > 0 && (
                <div className="bg-vintage text-brown px-3 py-1 rounded-full font-bold text-sm">
                  🃏 {appState.jokers}
                </div>
              )}
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
                  onOpenInspiration();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-cream hover:bg-brown/50"
              >
                🎲 Inspiration
              </button>
              <button
                onClick={() => {
                  onNavigate('shop');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentView === 'shop'
                    ? 'bg-cream text-brown'
                    : 'text-cream hover:bg-brown/50'
                }`}
              >
                🛒 Shop
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

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed left-0 top-16 bottom-0 bg-brown border-r-4 border-brown shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full p-6">
          {/* User Info */}
          <div className="mb-8 pb-6 border-b-2 border-cream/20">
            {appState.userName && (
              <div className="text-cream text-lg font-bold mb-4">
                Hallo, {appState.userName}!
              </div>
            )}
            {appState.jokers > 0 && (
              <div className="bg-vintage text-brown px-4 py-2 rounded-full font-bold text-lg border-2 border-vintage inline-block">
                🃏 {appState.jokers} Joker
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-cream text-brown shadow-lg scale-105'
                  : 'text-cream hover:bg-cream/10'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => onNavigate('archive')}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'archive'
                  ? 'bg-cream text-brown shadow-lg scale-105'
                  : 'text-cream hover:bg-cream/10'
              }`}
            >
              📦 Archiv
            </button>
            <button
              onClick={onOpenInspiration}
              className="w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-cream hover:bg-cream/10 transition-all"
            >
              🎲 Inspiration
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'shop'
                  ? 'bg-cream text-brown shadow-lg scale-105'
                  : 'text-cream hover:bg-cream/10'
              }`}
            >
              🛒 Shop
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'settings'
                  ? 'bg-cream text-brown shadow-lg scale-105'
                  : 'text-cream hover:bg-cream/10'
              }`}
            >
              ⚙️ Einstellungen
            </button>
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t-2 border-cream/20">
            <div className="text-cream/60 text-sm">
              PAPYR v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for sidebar (optional - for closing when clicking outside) */}
      {sidebarOpen && (
        <div
          className="hidden md:block fixed inset-0 bg-black/20 z-30 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
