// /components/Checkout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useUser } from '../../context/AuthContext';
import { useCart } from '../../context/cartContext';
import { handleError } from '@/utils/errorUtils';
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

const Checkout: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useUser();
    const { setCartData } = useCart();
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            setCheckoutData(JSON.parse(decodeURIComponent(data)) as CheckoutData);
        }
    }, [searchParams]);

    const handleConfirmOrder = async () => {
        if (!user || !checkoutData) return;
        try {
            const orderRef = collection(db, `users/${user.uid}/orders`);
            await addDoc(orderRef, {
                items: checkoutData.items,
                total: checkoutData.total,
                timestamp: new Date()
            });
            console.log("Order successfully placed!");

            // Clear cart in Firestore
            const cartRef = collection(db, `users/${user.uid}/cart`);
            const cartSnapshot = await getDocs(cartRef);
            cartSnapshot.forEach(async (item) => {
                await deleteDoc(doc(db, `users/${user.uid}/cart`, item.id));
            });

            // Clear cart in React state
            setCartData([]);

            // Redirect to post-checkout page
            router.push('/postCheckout');
        } catch (error) {
            // Using custom error handling to prevent using any
            handleError(error)
        }
    };

    if (!checkoutData) return <p className={styles.spinner}>Loading checkout...</p>;

    return (
        <div className={styles.checkoutContainer}>
            <h1>Review Your Order</h1>
            <ul className={styles.checkoutList}>
                {checkoutData.items.map((item: CheckoutItem) => (
                    <li key={item.id} className={styles.checkoutItem}>
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                        <span>Quantity: {item.quantity}</span>
                    </li>
                ))}
            </ul>
            <h2 className={styles.total}>Total: ${checkoutData.total.toFixed(2)}</h2>
            <button className={styles.confirmButton} onClick={handleConfirmOrder}>Confirm Order</button>
        </div>
    );
};

export default Checkout;
