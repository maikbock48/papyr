'use client';

import { useState, useEffect } from 'react';
import { getAppState } from '@/lib/storage';
import { getTimeUntilNextWindow, formatCountdown } from '@/lib/countdown';
import { isWithinWolfHour } from '@/lib/storage';
import { useAuth } from '@/lib/supabase/context';

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
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { profile } = useAuth();

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const time = getTimeUntilNextWindow();
      setCountdown({ hours: time.hours, minutes: time.minutes, seconds: time.seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const menuStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif'
  };

  // Helper function to color 4th letter green
  const colorFourthLetter = (text: string) => {
    if (text.length < 4) return text;
    return (
      <>
        {text.substring(0, 3)}
        <span style={{ color: '#10B981' }}>{text[3]}</span>
        {text.substring(4)}
      </>
    );
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="border-b-2 shadow-sm sticky top-0 z-50" style={{ backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:justify-center items-center h-16">
            {/* Desktop Toggle Button - Left */}
            <button
              onClick={() => onSidebarToggle(!sidebarOpen)}
              className="hidden md:block absolute left-6 w-7 h-7 flex flex-col justify-center items-center gap-1.5 group"
            >
              <span
                className={`block w-full h-0.5 bg-black transition-all duration-700 ${
                  sidebarOpen
                    ? 'rotate-[-360deg] bg-[#10B981]'
                    : 'rotate-0'
                }`}
              />
              <span className="block w-full h-0.5 bg-black" />
              <span
                className={`block w-full h-0.5 bg-black transition-all duration-500 ${
                  sidebarOpen
                    ? 'rotate-[-45deg]'
                    : 'rotate-0'
                }`}
              />
            </button>

            {/* Global Counter - Centered */}
            <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl text-black whitespace-nowrap font-medium">
                  Heute wurden
                </span>
                <span className="text-2xl md:text-3xl font-bold text-black">
                  {globalPulse.toLocaleString()}
                </span>
                <span className="text-2xl md:text-3xl text-black whitespace-nowrap font-medium">
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
                className="w-6 h-6 flex flex-col justify-center items-center gap-1.5"
              >
                <span
                  className={`block w-full h-0.5 bg-black transition-all duration-700 ${
                    mobileMenuOpen
                      ? 'rotate-[-360deg] bg-[#10B981]'
                      : 'rotate-0'
                  }`}
                />
                <span className="block w-full h-0.5 bg-black" />
                <span
                  className={`block w-full h-0.5 bg-black transition-all duration-500 ${
                    mobileMenuOpen
                      ? 'rotate-[-45deg]'
                      : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}>
            <div className="px-4 pt-2 pb-4 space-y-3">
              {appState.userName && (
                <div className="text-black/70 text-base pb-2 border-b font-medium flex items-center gap-2" style={{ borderColor: '#2d2e2e' }}>
                  <span>Hallo, {appState.userName}</span>
                  {profile?.is_pro && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-sm">
                      ✨ Pro
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-lg font-bold ${
                  currentView === 'dashboard'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {colorFourthLetter('Dashboard')}
              </button>
              <button
                onClick={() => {
                  onNavigate('archive');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-lg font-bold ${
                  currentView === 'archive'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {colorFourthLetter('Archiv')}
              </button>
              <button
                onClick={() => {
                  onOpenInspiration();
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className="block w-full text-left px-3 py-2 rounded-lg text-lg font-bold text-black hover:bg-black/10"
              >
                {colorFourthLetter('Inspiration')}
              </button>
              <button
                onClick={() => {
                  onNavigate('shop');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-lg font-bold ${
                  currentView === 'shop'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {colorFourthLetter('Shop')}
              </button>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-lg font-bold ${
                  currentView === 'settings'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {colorFourthLetter('Einstellungen')}
              </button>
              <button
                onClick={() => {
                  onNavigate('rules');
                  setMobileMenuOpen(false);
                }}
                style={menuStyle}
                className={`block w-full text-left px-3 py-2 rounded-lg text-lg font-bold ${
                  currentView === 'rules'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {colorFourthLetter('Spielregeln')}
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
        style={{ width: '280px', backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}
      >
        <div className="flex flex-col h-full p-6">
          {/* User Info */}
          <div className="mb-8 pb-6 border-b-2" style={{ borderColor: '#2d2e2e' }}>
            {appState.userName && (
              <div className="text-black text-xl font-bold mb-4 flex items-center gap-2 flex-wrap">
                <span>Hallo, {appState.userName}!</span>
                {profile?.is_pro && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md">
                    ✨ Pro
                  </span>
                )}
              </div>
            )}
            {appState.jokers > 0 && (
              <div className="bg-white px-4 py-2 rounded-full font-bold text-lg border-2 inline-block shadow-sm" style={{ color: '#2d2e2e', borderColor: '#2d2e2e' }}>
                🃏 {appState.jokers} Joker
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => onNavigate('dashboard')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-xl font-bold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              {colorFourthLetter('Dashboard')}
            </button>
            <button
              onClick={() => onNavigate('archive')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-xl font-bold transition-all ${
                currentView === 'archive'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              {colorFourthLetter('Archiv')}
            </button>
            <button
              onClick={onOpenInspiration}
              style={menuStyle}
              className="w-full text-left px-4 py-3 rounded-lg text-xl font-bold text-black hover:bg-black/10 transition-all"
            >
              {colorFourthLetter('Inspiration')}
            </button>
            <button
              onClick={() => onNavigate('shop')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-xl font-bold transition-all ${
                currentView === 'shop'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              {colorFourthLetter('Shop')}
            </button>
            <button
              onClick={() => onNavigate('settings')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-xl font-bold transition-all ${
                currentView === 'settings'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              {colorFourthLetter('Einstellungen')}
            </button>
            <button
              onClick={() => onNavigate('rules')}
              style={menuStyle}
              className={`w-full text-left px-4 py-3 rounded-lg text-xl font-bold transition-all ${
                currentView === 'rules'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              {colorFourthLetter('Spielregeln')}
            </button>
          </nav>

          {/* Stamps Section */}
          <div className="flex-1 mb-6 flex flex-col justify-center gap-3">
            {/* Streak Stamp */}
            <button
              onClick={() => onNavigate('subscription')}
              className="rounded-xl p-2 shadow-lg relative transition-all hover:scale-105 cursor-pointer overflow-hidden w-full"
              style={{
                border: '3px solid #ffffff',
                backgroundColor: 'transparent',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                height: '60px'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span style={{ fontSize: '3rem' }}>🔥</span>
              </div>
              <div className="relative flex items-center justify-center h-full">
                <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {appState.currentStreak}
                </span>
              </div>
            </button>

            {/* Joker Stamp */}
            <button
              onClick={() => onNavigate('subscription')}
              className="rounded-xl p-2 shadow-lg relative transition-all hover:scale-105 cursor-pointer overflow-hidden w-full"
              style={{
                border: '3px solid #ffffff',
                backgroundColor: 'transparent',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                height: '60px'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span style={{ fontSize: '3rem' }}>🃏</span>
              </div>
              <div className="relative flex items-center justify-center h-full">
                <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {appState.jokers}
                </span>
              </div>
            </button>
          </div>

          {/* Countdown to next upload window */}
          <div className="mb-6 px-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <div className="text-center">
                <p className="text-xs font-medium mb-2" style={{ color: '#ffffff', opacity: 0.8 }}>
                  Nächstes Upload-Fenster in:
                </p>
                <p className="text-2xl font-bold font-mono" style={{ color: '#ffffff' }}>
                  {formatCountdown(countdown.hours, countdown.minutes, countdown.seconds)}
                </p>
              </div>
            </div>
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
