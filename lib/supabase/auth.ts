import { createClient } from './client'
import { createProfile } from './database'

// Sign up with email and password
export async function signUp(email: string, password: string, userName?: string) {
  console.log('[Auth] Starting signup for:', email)
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: userName
      }
    }
  })

  if (error) {
    console.error('[Auth] Signup error:', error)
    throw error
  }

  console.log('[Auth] Signup response:', {
    hasUser: !!data.user,
    hasSession: !!data.session,
    user: data.user
  })

  // Only create profile if we have a session (user is confirmed)
  if (data.user && data.session) {
    console.log('[Auth] User has session, creating profile...')
    try {
      await createProfile(email, userName)
      console.log('[Auth] Profile created successfully')
    } catch (profileError) {
      console.error('[Auth] Error creating profile:', profileError)
      // Don't throw - profile will be created on first login
    }
  } else if (data.user && !data.session) {
    console.log('[Auth] User created but needs email confirmation')
  }

  return data
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return null
  }

  return user
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

// Send password reset email
export async function resetPassword(email: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) throw error
}

// Update password
export async function updatePassword(newPassword: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}

// Sign in with OAuth (Google, GitHub, etc.)
export async function signInWithOAuth(provider: 'google' | 'github' | 'apple') {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)

  return subscription
}
