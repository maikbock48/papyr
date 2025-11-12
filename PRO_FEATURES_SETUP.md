# Pro Features Setup Guide

This guide explains how to complete the Pro membership integration for PAPYR.

## Overview

The following Pro features have been implemented:

1. **Pro Badge Display** - Shows "✨ Pro" badge next to username in Navbar
2. **Extra-Joker Monthly System** - Pro members receive 1 bonus joker every 30 days
3. **Ritual Unlock** - Pro members can access the exclusive ritual feature in Inspiration Browser
4. **30-Day Streak Requirement** - Pro membership is only available to users with ≥30 days streak

## Database Migrations Required

You need to run the following SQL migrations in your Supabase SQL Editor:

### 1. Add `is_pro` field (if not already present)

**File:** `lib/supabase/add-pro-field.sql`

```sql
-- Add is_pro field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- Add comment to explain the field
COMMENT ON COLUMN profiles.is_pro IS 'Premium Pro membership status (4.99 EUR/month)';

-- Update existing paid users to have is_pro=false by default (they need to upgrade)
UPDATE profiles
SET is_pro = FALSE
WHERE has_paid = TRUE AND is_pro IS NULL;
```

### 2. Add `last_monthly_joker_date` field

**File:** `lib/supabase/add-monthly-joker-field.sql`

```sql
-- Add last_monthly_joker_date field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_monthly_joker_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add comment to explain the field
COMMENT ON COLUMN profiles.last_monthly_joker_date IS 'Timestamp of when the last monthly Pro joker was awarded';

-- Initialize the field for existing Pro users to current date
UPDATE profiles
SET last_monthly_joker_date = NOW()
WHERE is_pro = TRUE AND last_monthly_joker_date IS NULL;
```

## How to Run Migrations

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to the SQL Editor (left sidebar)
4. Create a new query
5. Copy and paste the SQL from `lib/supabase/add-pro-field.sql`
6. Click "Run" or press Cmd/Ctrl + Enter
7. Repeat steps 4-6 for `lib/supabase/add-monthly-joker-field.sql`

## Environment Variables

Make sure you have the Pro price ID in your `.env.local` file:

```env
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_1SSbgs1YcO38OM7YBwBVEEgI
```

## Testing the Pro Features

### Test Pro Badge Display

1. Create a test user or use an existing user
2. Manually set `is_pro = TRUE` in the Supabase profiles table
3. Log in and verify the "✨ Pro" badge appears next to the username in the Navbar (both mobile and desktop)

### Test 30-Day Streak Requirement

1. Go to `/subscription` page
2. If user has < 30 days streak:
   - Pro button should be disabled
   - Should show message: "🔥 Erst ab 30 Tage Streak verfügbar!"
3. Manually set `current_streak = 30` in Supabase
4. Refresh page - Pro button should now be enabled

### Test Monthly Joker System

1. Set a user as Pro: `is_pro = TRUE`
2. Log in with that user
3. On login, they should receive a welcome joker and alert: "🎉 Willkommen als Pro! Du erhältst deinen ersten monatlichen Bonus-Joker!"
4. The `last_monthly_joker_date` should be set to current timestamp
5. To test monthly award:
   - Manually set `last_monthly_joker_date` to 31 days ago
   - Log in again
   - User should receive another joker with alert: "🃏 Pro Bonus! Du erhältst deinen monatlichen Extra-Joker!"

### Test Ritual Unlock

1. Go to Dashboard and click "Inspiration"
2. As a non-Pro user:
   - The "Kopieren" button should show "🔒 Kopieren (Pro)"
   - Clicking it should show alert: "✨ Das Ritual ist nur für Pro Members verfügbar!"
3. As a Pro user:
   - The "Kopieren" button should show "✨ Kopieren" with gold gradient styling
   - Clicking it should open the Ritual popup

## Stripe Webhook Integration

The webhook handler automatically:

1. **On checkout.session.completed:**
   - Detects if subscription is Pro (checks price ID)
   - Sets `is_pro = TRUE` for Pro subscriptions
   - Sets `is_pro = FALSE` for Basic subscriptions
   - Initializes `last_monthly_joker_date` for new Pro users

2. **On customer.subscription.deleted:**
   - Sets `is_pro = FALSE` and `has_paid = FALSE`

3. **On customer.subscription.updated:**
   - Updates `is_pro` based on subscription price ID
   - Only sets `is_pro = TRUE` if subscription is active/trialing

## Pro Features Summary

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Pro Badge** | Gold "✨ Pro" badge next to username | `components/Navbar.tsx` |
| **Monthly Extra-Joker** | 1 bonus joker every 30 days | `lib/supabase/database.ts` - `checkAndAwardMonthlyProJoker()` |
| **Ritual Access** | Exclusive access to ritual popup | `components/InspirationBrowser.tsx` |
| **30-Day Requirement** | Can only subscribe if streak ≥30 | `components/Subscription.tsx` |
| **Stripe Integration** | Automatic Pro status updates | `app/api/stripe/webhook/route.ts` |

## Files Modified

### Database
- `lib/supabase/database.ts` - Added `checkAndAwardMonthlyProJoker()` function
- `lib/supabase/add-pro-field.sql` - Migration for is_pro field
- `lib/supabase/add-monthly-joker-field.sql` - Migration for monthly joker tracking

### Components
- `components/Navbar.tsx` - Pro badge display in mobile menu and desktop sidebar
- `components/Subscription.tsx` - Pro tier with 30-day streak requirement
- `components/InspirationBrowser.tsx` - Ritual unlock for Pro users

### API
- `app/api/stripe/webhook/route.ts` - Pro status detection and updates
- `app/api/stripe/checkout/route.ts` - Dynamic price ID support

### Context
- `lib/supabase/context.tsx` - Auto-check and award monthly Pro joker on login

## Deployment Checklist

- [ ] Run database migrations in Supabase
- [ ] Verify environment variables are set (especially `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`)
- [ ] Test Stripe webhook in test mode
- [ ] Create test Pro subscription and verify all features work
- [ ] Test 30-day streak requirement
- [ ] Update production Stripe webhook endpoint
- [ ] Deploy to production
- [ ] Monitor Stripe webhook logs for successful Pro conversions

## Support

If you encounter any issues:

1. Check Supabase logs for database errors
2. Check browser console for frontend errors
3. Check Stripe webhook logs for payment processing issues
4. Verify all environment variables are correctly set

## Future Enhancements

Potential improvements for Pro features:

- Dashboard showing next monthly joker date
- Pro member exclusive community access
- Additional ritual categories for Pro users
- Pro-only achievement badges
- Priority customer support badge
