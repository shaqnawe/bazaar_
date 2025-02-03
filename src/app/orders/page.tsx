'use client';

import { collection, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import thumbNail from '../../../public/static/images/avatar.jpg';
import { useUser } from '../context/AuthContext';
import { db } from '../lib/firebase';
import styles from './Orders.module.css';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    date: string; // UTC date string
}

const Orders: React.FC = () => {
    const { user, loading } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!user || loading) return;

        const ordersRef = collection(db, `users/${user.uid}/orders`);
        const unsubscribe = onSnapshot(
            ordersRef,
            (snapshot) => {
                const ordersData: Order[] = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        items: data.items ?? [],
                        date: data.timestamp ? data.timestamp.toDate().toUTCString() : "N/A",
                        total: data.total ?? 0,
                    };
                });
                setOrders(ordersData);
                // console.log(ordersData)
            },
            (error) => {
                console.error("Error fetching orders: ", error);
            }
        );

        return () => unsubscribe();
    }, [user, loading]);

    if (loading) {
        return <p className={styles.loading}>Loading orders...</p>;
    }

    if (!user) {
        return <p className={styles.loading}>User not authenticated.</p>;
    }

    // If the user doens't have any order history
    if (orders.length === 0) {
        return <div className={styles.ordersContainer}><h2>No orders found.</h2></div>;
    }

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.title}>My Orders</h1>
            <ul className={styles.ordersList}>
                {orders.map((order) => (
                    <li key={order.id} className={styles.orderItem}>
                        <div className={styles.orderDetails}>
                            {order.items.map((item) => (
                                <div key={item.id} className={styles.orderItemDetails}>
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.productName}>{item.name}</h3>
                                        <p className={styles.orderInfo}>Quantity: {item.quantity}</p>
                                        <p className={styles.orderInfo}>Price: ${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className={styles.orderImageContainer}>
                                        <Image
                                            // Workaround to not pass urls for actual images
                                            // but still diplay on orders page.
                                            src={item.imageUrl || thumbNail}
                                            alt={item.name}
                                            className={styles.orderImage}
                                            width={100}
                                            height={100}
                                            priority
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.orderSummary}>
                            <h2 className={styles.total}>Total: ${order?.total?.toFixed(2)}</h2>
                            <p className={styles.orderDate}>Ordered on: {order.date}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Orders;
