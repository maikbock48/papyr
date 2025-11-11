'use client';

import { useState } from 'react';
import { signUp, signIn, signInWithOAuth } from '@/lib/supabase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        console.log('[AuthModal] Starting signup...');
        const result = await signUp(email, password, userName);
        console.log('[AuthModal] Signup result:', result);

        // Check if email confirmation is needed
        if (result.user && !result.session) {
          alert('✅ Konto erstellt! Bitte überprüfe deine E-Mails, um dein Konto zu bestätigen.');
          setMode('signin'); // Switch to signin mode
          setEmail('');
          setPassword('');
        } else {
          // User is logged in immediately (no email confirmation required)
          alert('✅ Konto erfolgreich erstellt!');
          onSuccess();
          onClose();
        }
      } else {
        console.log('[AuthModal] Starting signin...');
        await signIn(email, password);
        console.log('[AuthModal] Signin successful');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('[AuthModal] Error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'apple') => {
    setError(null);
    setLoading(true);

    try {
      await signInWithOAuth(provider);
      // OAuth will redirect, so no need to call onSuccess here
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4" style={{ border: '2px solid #2d2e2e' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold hover:scale-110 transition-transform"
          style={{ color: '#2d2e2e' }}
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
            {mode === 'signin' ? 'Willkommen zurück' : 'Konto erstellen'}
          </h2>
          <p className="text-sm" style={{ color: '#666' }}>
            {mode === 'signin'
              ? 'Melde dich an, um fortzufahren'
              : 'Erstelle dein PAPYR Konto'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#2d2e2e' }}>
                Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-black transition-colors"
                style={{ borderColor: '#e0e0e0' }}
                placeholder="Dein Name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#2d2e2e' }}>
              E-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-black transition-colors"
              style={{ borderColor: '#e0e0e0' }}
              placeholder="deine@email.de"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#2d2e2e' }}>
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-black transition-colors"
              style={{ borderColor: '#e0e0e0' }}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-all hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Lädt...' : mode === 'signin' ? 'Anmelden' : 'Registrieren'}
          </button>
        </form>

        {/* OAuth Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#e0e0e0' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white" style={{ color: '#666' }}>
                Oder
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
              style={{ borderColor: '#e0e0e0', color: '#2d2e2e' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Mit Google anmelden
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-sm font-bold hover:underline"
            style={{ color: '#2d2e2e' }}
          >
            {mode === 'signin'
              ? 'Noch kein Konto? Registrieren'
              : 'Bereits registriert? Anmelden'}
          </button>
        </div>
      </div>
    </div>
  );
}
