'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Image from 'next/image';
import { removeFromFavorites } from '@/utils/favoritesUtils';
import styles from './Favorites.module.css';

interface FavoriteItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

const Favorites: React.FC = () => {
    const { user, loading } = useUser();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        if (!user) return;

        const favRef = collection(db, `users/${user.uid}/favorites`);
        const unsubscribe = onSnapshot(favRef, (snapshot) => {
            const favItems: FavoriteItem[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as FavoriteItem[];
            setFavorites(favItems);
        }, (error) => {
            console.error("Error fetching favorites:", error);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return <p className={styles.spinner}>Loading favorites...</p>;
    }

    if (!user) {
        return <p className={styles.spinner}>User not authenticated.</p>;
    }

    return (
        <div className={styles.favoritesContainer}>
            <h1 className={styles.title}>My Favorites</h1>
            {favorites.length === 0 ? (
                <p className={styles.emptyMessage}>No favorite items found.</p>
            ) : (
                <ul className={styles.favoritesList}>
                    {favorites.map((item) => (
                        <li key={item.id} className={styles.favoriteItem}>
                            <div className={styles.itemDetails}>
                                <h3 className={styles.itemName}>{item.name}</h3>
                                <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                                <button
                                    onClick={() => removeFromFavorites(item.id)}
                                    className={styles.removeButton}
                                >
                                    Remove
                                </button>
                            </div>
                            <div className={styles.itemImageContainer}>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className={styles.itemImage}
                                    width={250}
                                    height={250}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Favorites;
