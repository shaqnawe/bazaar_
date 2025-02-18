'use client';

import { handleError } from '@/utils/errorUtils';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/AuthContext';
import styles from './Checkout.module.css';

interface CheckoutItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CheckoutData {
    items: CheckoutItem[];
    total: number;
}

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const Checkout: React.FC = () => {
    const searchParams = useSearchParams();
    const { user } = useUser();
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

    // On mount, parse the checkout data passed via query parameters.
    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            setCheckoutData(JSON.parse(decodeURIComponent(data)) as CheckoutData);
        }
    }, [searchParams]);

    // Triggered when the user clicks Confirm Order.
    const handleConfirmOrder = async () => {
        if (!user || !checkoutData) return;
        try {
            // Create a Stripe Checkout Session on the backend
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: checkoutData.items,
                    userId: user.uid,
                    // You can include additional info if needed.
                })
            });

            const sessionData = await response.json();
            if (!response.ok) {
                throw new Error(sessionData.error || 'Failed to create checkout session.');
            }

            // Load Stripe.js and redirect to Stripe Checkout
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Stripe.js failed to load.");
            }
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionData.id,
            });
            if (error) {
                throw error;
            }
        } catch (error) {
            handleError(error);
        }
    };

    if (!checkoutData) {
        return <p className={styles.spinner}>Loading checkout...</p>;
    }

    return (
        <div className={styles.checkoutContainer}>
            <h1>Review Your Order</h1>
            <ul className={styles.checkoutList}>
                {checkoutData.items.map((item: CheckoutItem) => (
                    <li key={item.id} className={styles.checkoutItem}>
                        <span>{item.name}</span>
                        <span>${(item.price / 100).toFixed(2)}</span>
                        <span>Quantity: {item.quantity}</span>
                    </li>
                ))}
            </ul>
            <h2 className={styles.total}>Total: ${checkoutData.total.toFixed(2)}</h2>
            <button className={styles.confirmButton} onClick={handleConfirmOrder}>
                Confirm Order
            </button>
        </div>
    );
};

export default Checkout;
