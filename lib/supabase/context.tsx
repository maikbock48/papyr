'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, onAuthStateChange } from './auth';
import { Profile, getProfile } from './database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserAndProfile = async () => {
    console.log('[AuthProvider] Loading user and profile...');
    try {
      const currentUser = await getCurrentUser();
      console.log('[AuthProvider] Got user:', !!currentUser);
      setUser(currentUser);

      if (currentUser) {
        console.log('[AuthProvider] Loading profile for user...');
        const userProfile = await getProfile();
        console.log('[AuthProvider] Got profile:', !!userProfile);
        setProfile(userProfile);
      } else {
        console.log('[AuthProvider] No user, setting profile to null');
        setProfile(null);
      }
    } catch (error) {
      console.error('[AuthProvider] Error loading user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      console.log('[AuthProvider] Done loading, setting loading to false');
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getProfile();
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    loadUserAndProfile();

    // Listen for auth changes
    const subscription = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        loadUserAndProfile();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
