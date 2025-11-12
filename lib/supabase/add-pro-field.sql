-- Add is_pro field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- Add comment to explain the field
COMMENT ON COLUMN profiles.is_pro IS 'Premium Pro membership status (4.99 EUR/month)';

-- Update existing paid users to have is_pro=false by default (they need to upgrade)
UPDATE profiles
SET is_pro = FALSE
WHERE has_paid = TRUE AND is_pro IS NULL;
