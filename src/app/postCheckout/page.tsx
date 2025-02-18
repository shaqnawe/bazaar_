'use client';

import { addDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '../context/AuthContext';
import { useCart } from '../context/cartContext';
import { db } from '../lib/firebase';
import styles from './PostCheckout.module.css';

interface CartItemData {
    name: string;
    price: number;      // Price is assumed to be a number (e.g., in dollars)
    quantity: number;
    imageUrl?: string;
    createdAt?: any;
}

const PostCheckout: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const { setCartData } = useCart();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (!sessionId || !user) return;

        const saveOrderAndClearCart = async () => {
            try {
                // Reference to the user's cart collection.
                const cartRef = collection(db, `users/${user.uid}/cart`);
                // Get all cart items.
                const cartSnapshot = await getDocs(cartRef);
                // Map the documents into an array of item objects.
                const items = cartSnapshot.docs.map((docItem) => {
                    const data = docItem.data() as CartItemData;
                    return {
                        id: docItem.id,
                        ...data,
                    };
                });

                // Calculate the total
                const computedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                // Save the order details to Firestore, including the items.
                const orderRef = collection(db, `users/${user.uid}/orders`);
                await addDoc(orderRef, {
                    stripeSessionId: sessionId,
                    timestamp: new Date(),
                    items, // store all cart items
                    total: (computedTotal / 100).toFixed(2),
                });

                // Clear the user's cart from Firestore.
                const deletePromises = cartSnapshot.docs.map((docItem) =>
                    deleteDoc(docItem.ref)
                );
                await Promise.all(deletePromises);

                // Clear the cart in your React state.
                setCartData([]);

                setLoading(false);
            } catch (error) {
                console.error('Error processing order:', error);
                setLoading(false);
            }
        };

        saveOrderAndClearCart();
    }, [searchParams, user, setCartData]);

    if (loading) return <p>Processing your order...</p>;

    return (
        <div className={styles.postCheckoutContainer}>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. What would you like to do next?</p>
            <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => router.push('/products')}>
                    Continue Shopping
                </button>
                <button className={styles.secondaryButton} onClick={() => router.push('/orders')}>
                    View My Orders
                </button>
            </div>
        </div>
    );
};

export default PostCheckout;
