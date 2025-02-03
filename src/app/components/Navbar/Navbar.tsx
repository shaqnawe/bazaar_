'use client';

import React from 'react';
import { useUser } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { handleError } from '@/utils/errorUtils';

const Navbar: React.FC = () => {
    const { user, loading } = useUser();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out");
        } catch (error) {
            handleError(error)
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">Bazaar</Link>
            </div>
            <ul className={styles.navLinks}>
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/cart">Cart</Link></li>

                {loading ? (
                    <li className={styles.spinner}></li>
                ) : user ? (
                    <>
                        <li><Link href="/profile">Profile</Link></li>
                        <li><button onClick={handleLogout} className={styles.logoutButton}>Logout</button></li>
                    </>
                ) : (
                    <li><Link href="/auth/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
