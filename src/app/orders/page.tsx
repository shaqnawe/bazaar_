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
    imageUrl: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    date: string; // This will be the UTC date string from createdAt
}

const Orders: React.FC = () => {
    const { user, loading } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!user) return;

        const ordersRef = collection(db, `users/${user.uid}/orders`);
        const unsubscribe = onSnapshot(
            ordersRef,
            (snapshot) => {
                const ordersData: Order[] = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        items: data.items,
                        date: data.timestamp ? data.timestamp.toDate().toUTCString() : "N/A",
                        total: data.total
                    } as Order;
                });
                setOrders(ordersData);
                console.log(ordersData)
            },
            (error) => {
                console.error("Error fetching orders: ", error);
            }
        );

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return <p className={styles.loading}>Loading orders...</p>;
    }

    if (!user) {
        return <p className={styles.loading}>User not authenticated.</p>;
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
                                            src={thumbNail}
                                            alt={item.name}
                                            className={styles.orderImage}
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
