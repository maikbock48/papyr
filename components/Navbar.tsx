'use client';

import { useState } from 'react';
import { getAppState } from '@/lib/storage';

interface NavbarProps {
  currentView: 'dashboard' | 'archive' | 'settings' | 'shop' | 'rules' | 'subscription';
  onNavigate: (view: 'dashboard' | 'archive' | 'settings' | 'shop' | 'rules' | 'subscription') => void;
  onOpenInspiration: () => void;
  sidebarOpen: boolean;
  onSidebarToggle: (open: boolean) => void;
  globalPulse: number;
}

export default function Navbar({ currentView, onNavigate, onOpenInspiration, sidebarOpen, onSidebarToggle, globalPulse }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const appState = getAppState();

  const menuStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif'
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="border-b-2 shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#171717', borderColor: '#2d2e2e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:justify-center items-center h-16">
            {/* Desktop Toggle Button - Left */}
            <button
              onClick={() => onSidebarToggle(!sidebarOpen)}
              className="hidden md:block absolute left-6 text-cream hover:text-cream/70 transition-colors"
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

            {/* Global Counter - Centered */}
            <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base text-white/80 whitespace-nowrap">
                  Heute wurden
                </span>
                <span className="text-2xl md:text-3xl font-bold text-white">
                  {globalPulse.toLocaleString()}
                </span>
                <span className="text-sm md:text-base text-white/80 whitespace-nowrap">
                  Zettel abgegeben
                </span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2 absolute right-4">
              {appState.jokers > 0 && (
                <div className="bg-white px-3 py-1 rounded-full font-bold text-sm shadow-sm" style={{ color: '#2d2e2e' }}>
                  🃏 {appState.jokers}
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-white/70 transition-colors"
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
          <div className="md:hidden border-t" style={{ backgroundColor: '#1f1f1f', borderColor: '#2d2e2e' }}>
            <div className="px-4 pt-2 pb-4 space-y-3">
              {appState.userName && (
                <div className="text-white/60 text-sm pb-2 border-b" style={{ borderColor: '#2d2e2e' }}>
                  Hallo, {appState.userName}
                </div>
              )}
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                  currentView === 'dashboard'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate('archive');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                  currentView === 'archive'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Archiv
              </button>
              <button
                onClick={() => {
                  onOpenInspiration();
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10"
              >
                Inspiration
              </button>
              <button
                onClick={() => {
                  onNavigate('shop');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                  currentView === 'shop'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                  currentView === 'settings'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Einstellungen
              </button>
              <button
                onClick={() => {
                  onNavigate('rules');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                  currentView === 'rules'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Spielregeln
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed left-0 top-16 bottom-0 border-r-2 shadow-lg z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '280px', backgroundColor: '#171717', borderColor: '#2d2e2e' }}
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
              <div className="bg-white px-4 py-2 rounded-full font-bold text-lg border-2 inline-block shadow-sm" style={{ color: '#2d2e2e', borderColor: '#e0e0e0' }}>
                🃏 {appState.jokers} Joker
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => onNavigate('dashboard')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('archive')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'archive'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Archiv
            </button>
            <button
              onClick={onOpenInspiration}
              style={menuStyle}
              className="w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-white hover:bg-white/10 transition-all"
            >
              Inspiration
            </button>
            <button
              onClick={() => onNavigate('shop')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'shop'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => onNavigate('settings')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'settings'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Einstellungen
            </button>
            <button
              onClick={() => onNavigate('rules')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                currentView === 'rules'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Spielregeln
            </button>
          </nav>

          {/* Stamps Section */}
          <div className="mt-6 flex justify-center gap-3">
            {/* Streak Stamp */}
            <button
              onClick={() => onNavigate('subscription')}
              className="rounded-xl p-3 shadow-lg relative transition-all hover:scale-105 cursor-pointer"
              style={{
                border: '3px solid #ffffff',
                backgroundColor: 'transparent',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                flexBasis: '40%'
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold" style={{ color: '#ffffff' }}>
                  🔥 STREAK
                </span>
                <span className="text-xl font-bold" style={{ color: '#ffffff' }}>
                  {appState.currentStreak}
                </span>
              </div>
            </button>

            {/* Joker Stamp */}
            <button
              onClick={() => onNavigate('subscription')}
              className="rounded-xl p-3 shadow-lg relative transition-all hover:scale-105 cursor-pointer"
              style={{
                border: '3px solid #ffffff',
                backgroundColor: 'transparent',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                flexBasis: '40%'
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold" style={{ color: '#ffffff' }}>
                  🃏 JOKER
                </span>
                <span className="text-xl font-bold" style={{ color: '#ffffff' }}>
                  {appState.jokers}
                </span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t" style={{ borderColor: '#2d2e2e' }}>
            <div className="flex justify-center">
              <img
                src="/assets/PAPYR.jpg"
                alt="PAPYR"
                className="h-16 w-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
