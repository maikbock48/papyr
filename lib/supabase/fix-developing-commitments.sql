-- Fix all commitments stuck in "developing" state
-- This sets all commitments to is_developing = false
UPDATE commitments
SET is_developing = FALSE
WHERE is_developing = TRUE;

-- Verify the update
SELECT COUNT(*) as updated_count
FROM commitments
WHERE is_developing = FALSE;
