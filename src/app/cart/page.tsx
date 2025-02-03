'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/cartContext';
import { removeFromCart, updateCartItem } from '../../utils/cartUtils';
import styles from './Cart.module.css';

const Cart: React.FC = () => {
    const { cartData, grandTotal } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        const checkoutData = {
            items: cartData,
            total: grandTotal
        };

        // Navigate to checkout page with cart data
        router.push(`/checkout?data=${encodeURIComponent(JSON.stringify(checkoutData))}`);
    };

    if (!cartData) return <p className={styles.spinner}></p>;

    return (
        <div className={styles.cartContainer}>
            <h1>Your Cart</h1>
            {cartData.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul className={styles.cartList}>
                        {cartData.map(item => (
                            <li key={item.id} className={styles.cartItem}>
                                <span>{item.name}</span>
                                <span>${item.price.toFixed(2)}</span>
                                <span>Quantity: {item.quantity}</span>
                                <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
                                <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h2 className={styles.total}>Grand Total: ${grandTotal.toFixed(2)}</h2>
                    <button className={styles.checkoutButton} onClick={handleCheckout}>Proceed to Checkout</button>
                </>
            )}
        </div>
    );
};

export default Cart;
