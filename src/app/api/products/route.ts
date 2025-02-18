import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-01-27.acacia',
});

// Named export for GET method
export async function GET() {
    try {
        const products = await stripe.products.list({
            expand: ['data.default_price'],
        });
        console.log(products.data)
        return NextResponse.json(products.data);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
