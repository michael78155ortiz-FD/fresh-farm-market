// src/app/api/checkout/sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutRateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CartItem = {
  id: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  price_cents?: number;
  price?: number;
  currency?: string;
};

export async function POST(req: NextRequest) {
  try {
    // Check env at runtime
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create Stripe client at runtime
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20" as any,
    });

    // Rate limit check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
    const { success } = await checkoutRateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];
    
    if (items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const currency = (items[0]?.currency || "usd").toLowerCase();
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (i) => {
        const unit = Number(i.price_cents ?? i.price ?? 0);
        if (!unit || unit < 1) {
          throw new Error(
            `Invalid price for "${i.name}". Each item needs a positive price_cents.`
          );
        }
        return {
          quantity: i.quantity,
          price_data: {
            currency,
            unit_amount: unit,
            product_data: {
              name: i.name,
              images: i.imageUrl ? [i.imageUrl] : [],
              metadata: { product_id: i.id },
            },
          },
        };
      }
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancelled`,
      metadata: { site: siteUrl },
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (e: any) {
    console.error("create session error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to create session" },
      { status: 500 }
    );
  }
}
