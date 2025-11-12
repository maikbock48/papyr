-- Add last_monthly_joker_date field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_monthly_joker_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add comment to explain the field
COMMENT ON COLUMN profiles.last_monthly_joker_date IS 'Timestamp of when the last monthly Pro joker was awarded';

-- Initialize the field for existing Pro users to current date
UPDATE profiles
SET last_monthly_joker_date = NOW()
WHERE is_pro = TRUE AND last_monthly_joker_date IS NULL;
