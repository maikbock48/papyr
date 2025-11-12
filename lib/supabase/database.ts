import { createClient } from './client'
import { createClient as createServerClient } from './server'

// Types matching our database schema
export interface Profile {
  id: string
  email: string
  user_name: string | null
  has_completed_onboarding: boolean
  has_paid: boolean
  is_pro: boolean
  current_streak: number
  last_commitment_date: string | null
  ten_year_vision: string | null
  has_completed_seven_day_reflection: boolean
  jokers: number
  last_shown_popup_day: number | null
  total_commitments: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  last_monthly_joker_date: string | null
  notification_settings: {
    enabled: boolean
    morning: boolean
    afternoon: boolean
    evening: boolean
  }
  created_at: string
  updated_at: string
}

export interface Commitment {
  id: string
  user_id: string
  date: string
  image_url: string
  goals: string
  is_developing: boolean
  signature_initials: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

// Profile Functions
export async function getProfile(userId?: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const targetUserId = userId || user?.id

  if (!targetUserId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data as Profile
}

export async function createProfile(email: string, userName?: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email,
      user_name: userName || null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export async function updateProfile(updates: Partial<Profile>) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

// Commitment Functions
export async function getCommitments(limit?: number) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('commitments')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching commitments:', error)
    return []
  }

  return data as Commitment[]
}

export async function createCommitment(
  imageFile: File,
  goals: string,
  initialsOrBoolean: string | boolean = false
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Get current profile to calculate streak and jokers
  const profile = await getProfile()
  if (!profile) throw new Error('Profile not found')

  const today = new Date().toISOString().split('T')[0]

  // Calculate streak with Joker system
  let newStreak = profile.current_streak
  let jokersUsed = 0

  if (profile.last_commitment_date) {
    const lastDate = new Date(profile.last_commitment_date)
    const currentDate = new Date(today)
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      // Consecutive day - continue streak
      newStreak += 1
    } else if (diffDays === 2 && profile.jokers > 0) {
      // Missed exactly 1 day - use Joker automatically
      jokersUsed = 1
      newStreak += 1
    } else if (diffDays > 1) {
      // Missed more than 1 day or no Joker available - reset streak
      newStreak = 1
    }
  } else {
    newStreak = 1
  }

  // Award Joker every 7 days of streak
  let newJokers = profile.jokers - jokersUsed
  if (newStreak > 0 && newStreak % 7 === 0) {
    newJokers += 1
  }

  // Upload image to storage
  const fileExt = imageFile.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('commitment-images')
    .upload(fileName, imageFile)

  if (uploadError) throw uploadError

  // Get public URL for the image
  const { data: urlData } = supabase.storage
    .from('commitment-images')
    .getPublicUrl(fileName)

  // Handle initials - can be string (custom initials) or boolean (auto-generate from user_name)
  let initials: string | null = null
  if (typeof initialsOrBoolean === 'string' && initialsOrBoolean.trim()) {
    initials = initialsOrBoolean.trim().toUpperCase()
  } else if (initialsOrBoolean === true && profile.user_name) {
    initials = profile.user_name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
  }

  // Create commitment
  const { data: commitment, error: commitmentError } = await supabase
    .from('commitments')
    .insert({
      user_id: user.id,
      date: today,
      image_url: urlData.publicUrl,
      goals,
      signature_initials: initials,
      is_developing: true,
    })
    .select()
    .single()

  if (commitmentError) throw commitmentError

  // Update profile
  await updateProfile({
    current_streak: newStreak,
    jokers: newJokers,
    last_commitment_date: today,
    total_commitments: profile.total_commitments + 1,
  })

  return {
    commitment: commitment as Commitment,
    jokersUsed,
    newStreak,
    newJokers,
  }
}

export async function updateCommitment(id: string, updates: Partial<Commitment>) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('commitments')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data as Commitment
}

export async function markCommitmentDeveloped(id: string) {
  return updateCommitment(id, { is_developing: false })
}

export async function markCommitmentCompleted(id: string) {
  return updateCommitment(id, { completed: true })
}

export async function deleteCommitment(id: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Get the commitment to delete its image
  const { data: commitment } = await supabase
    .from('commitments')
    .select('image_url')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (commitment?.image_url) {
    // Extract file path from URL
    const url = new URL(commitment.image_url)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts.slice(-2).join('/') // user_id/filename.ext

    // Delete from storage
    await supabase.storage
      .from('commitment-images')
      .remove([fileName])
  }

  // Delete commitment
  const { error } = await supabase
    .from('commitments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function deleteAllCommitments() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Get all commitments to delete their images
  const { data: commitments } = await supabase
    .from('commitments')
    .select('image_url')
    .eq('user_id', user.id)

  if (commitments && commitments.length > 0) {
    // Delete all images from storage
    const fileNames = commitments
      .map(c => {
        if (c.image_url) {
          const url = new URL(c.image_url)
          const pathParts = url.pathname.split('/')
          return pathParts.slice(-2).join('/') // user_id/filename.ext
        }
        return null
      })
      .filter(Boolean) as string[]

    if (fileNames.length > 0) {
      await supabase.storage
        .from('commitment-images')
        .remove(fileNames)
    }
  }

  // Delete all commitments
  const { error } = await supabase
    .from('commitments')
    .delete()
    .eq('user_id', user.id)

  if (error) throw error
}

// Onboarding Functions
export async function completeOnboarding(hasPaid: boolean, userName: string) {
  return updateProfile({
    has_completed_onboarding: true,
    has_paid: hasPaid,
    user_name: userName,
  })
}

export async function completeSevenDayReflection(vision: string, hasPaid: boolean) {
  return updateProfile({
    ten_year_vision: vision,
    has_completed_seven_day_reflection: true,
    has_paid: hasPaid,
  })
}

// Utility Functions
export async function canCommitToday() {
  const profile = await getProfile()
  if (!profile) return true

  const today = new Date().toISOString().split('T')[0]
  return profile.last_commitment_date !== today
}

export async function needsPaywall() {
  const profile = await getProfile()
  if (!profile) return false

  // 14 days free trial
  return profile.total_commitments >= 14 && !profile.has_paid
}

export async function needsSevenDayReflection() {
  const profile = await getProfile()
  if (!profile) return false

  return profile.current_streak === 7 && !profile.has_completed_seven_day_reflection
}

// Image Upload Helper (for converting File to upload)
export async function uploadCommitmentImage(file: File): Promise<string> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('commitment-images')
    .upload(fileName, file)

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('commitment-images')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

// Pro User Functions
export async function checkAndAwardMonthlyProJoker() {
  const profile = await getProfile()
  if (!profile) return { awarded: false }

  // Only for Pro users
  if (!profile.is_pro) return { awarded: false }

  const now = new Date()

  // If no last_monthly_joker_date, set it to now and award a joker (first time Pro)
  if (!profile.last_monthly_joker_date) {
    await updateProfile({
      jokers: profile.jokers + 1,
      last_monthly_joker_date: now.toISOString(),
    })
    return { awarded: true, message: '🎉 Willkommen als Pro! Du erhältst deinen ersten monatlichen Bonus-Joker!' }
  }

  // Check if 30 days (1 month) have passed
  const lastJokerDate = new Date(profile.last_monthly_joker_date)
  const daysSinceLastJoker = Math.floor((now.getTime() - lastJokerDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceLastJoker >= 30) {
    await updateProfile({
      jokers: profile.jokers + 1,
      last_monthly_joker_date: now.toISOString(),
    })
    return { awarded: true, message: '🃏 Pro Bonus! Du erhältst deinen monatlichen Extra-Joker!' }
  }

  return { awarded: false }
}
