import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      throw new Error('Missing Stripe publishable key')
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

// Redirect to Stripe Checkout
export async function redirectToCheckout() {
  try {
    // Call our API to create a checkout session
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Fehler beim Erstellen der Checkout Session')
    }

    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url
    } else {
      throw new Error('Keine Checkout URL erhalten')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    throw error
  }
}
