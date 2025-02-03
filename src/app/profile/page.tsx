'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Profile.module.css';
import { handleError } from '@/utils/errorUtils';

interface UserData {
    name?: string;
    email?: string;
}


const Profile: React.FC = () => {
    const { user, loading } = useUser();
    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        const fetchUserData = async () => {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        };
        fetchUserData();
    }, [user, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/auth/login');
        } catch (error) {
            handleError(error)
        }
    };

    if (loading) return <p className={styles.spinner}>Loading...</p>;
    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {userData && <p>User: {userData?.email}</p>}
                <h1 className={styles.title}>Welcome</h1>
                <ul className={styles.links}>
                    <li><Link href="/orders">Previous Orders</Link></li>
                    <li><Link href="/profile/update-password">Update Password</Link></li>
                    <li><Link href="/profile/favorites">Favorites</Link></li>
                </ul>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>
        </div>
    );
};

export default Profile;
