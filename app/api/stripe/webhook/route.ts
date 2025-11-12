import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (userId && session.subscription) {
          // Get subscription to check the price
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // Check if it's a Pro subscription
          const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!
          const isPro = subscription.items.data.some(
            item => item.price.id === proPriceId
          )

          // Prepare update data
          const updateData: any = {
            has_paid: true,
            is_pro: isPro,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          }

          // If becoming Pro for the first time, initialize monthly joker date
          if (isPro) {
            updateData.last_monthly_joker_date = new Date().toISOString()
          }

          // Update user's payment status and pro status
          const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)

          if (error) {
            console.error('Error updating profile:', error)
          } else {
            console.log(`✅ User payment status updated: ${userId} (Pro: ${isPro})`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by subscription ID and set has_paid and is_pro to false
        const { error } = await supabase
          .from('profiles')
          .update({
            has_paid: false,
            is_pro: false,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription status:', error)
        } else {
          console.log('✅ Subscription cancelled for subscription:', subscription.id)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status based on Stripe status
        const isPaid = subscription.status === 'active' || subscription.status === 'trialing'

        // Check if it's a Pro subscription
        const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!
        const isPro = subscription.items.data.some(
          item => item.price.id === proPriceId
        )

        const { error } = await supabase
          .from('profiles')
          .update({
            has_paid: isPaid,
            is_pro: isPaid ? isPro : false, // Only set is_pro if subscription is active
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription status:', error)
        } else {
          console.log(`✅ Subscription updated: ${subscription.id} (Status: ${subscription.status}, Pro: ${isPro})`)
        }
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
