-- PAPYR Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_name TEXT,
  has_completed_onboarding BOOLEAN DEFAULT false,
  has_paid BOOLEAN DEFAULT false,
  is_pro BOOLEAN DEFAULT false,
  current_streak INTEGER DEFAULT 0,
  last_commitment_date DATE,
  ten_year_vision TEXT,
  has_completed_seven_day_reflection BOOLEAN DEFAULT false,
  jokers INTEGER DEFAULT 0,
  last_shown_popup_day INTEGER,
  total_commitments INTEGER DEFAULT 0,
  notification_settings JSONB DEFAULT '{"enabled": false, "morning": false, "afternoon": false, "evening": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commitments Table
CREATE TABLE IF NOT EXISTS commitments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  image_url TEXT NOT NULL,
  goals TEXT NOT NULL,
  is_developing BOOLEAN DEFAULT true,
  signature_initials TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_commitments_user_id ON commitments(user_id);
CREATE INDEX IF NOT EXISTS idx_commitments_date ON commitments(date DESC);
CREATE INDEX IF NOT EXISTS idx_commitments_user_date ON commitments(user_id, date DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Commitments Policies
-- Users can view their own commitments
CREATE POLICY "Users can view own commitments"
  ON commitments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own commitments
CREATE POLICY "Users can insert own commitments"
  ON commitments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own commitments
CREATE POLICY "Users can update own commitments"
  ON commitments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own commitments
CREATE POLICY "Users can delete own commitments"
  ON commitments FOR DELETE
  USING (auth.uid() = user_id);

-- Storage Bucket for commitment images
-- Run this separately or via Supabase Dashboard
-- Storage > Create new bucket > Name: "commitment-images", Public: false

-- Storage Policies (run after creating bucket)
-- INSERT policy for authenticated users
CREATE POLICY "Users can upload commitment images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'commitment-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- SELECT policy for users to view their own images
CREATE POLICY "Users can view own commitment images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'commitment-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- DELETE policy for users to delete their own images
CREATE POLICY "Users can delete own commitment images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'commitment-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
