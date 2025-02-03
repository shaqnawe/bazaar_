'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './PostCheckout.module.css';

const PostCheckout: React.FC = () => {
    const router = useRouter();

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
