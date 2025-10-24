import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabase = getAdminSupabase();

    if (!stripeKey || !webhookSecret || !supabase) {
      return NextResponse.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey);
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { ok: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status
        await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            payment_intent_id: session.payment_intent as string,
            paid_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        await supabase
          .from('orders')
          .update({ status: 'failed' })
          .eq('payment_intent_id', paymentIntent.id);
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ ok: true, received: true });
  } catch (e: any) {
    console.error('Webhook error:', e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Webhook failed" },
      { status: 400 }
    );
  }
}
