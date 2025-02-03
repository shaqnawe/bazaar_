'use client';

import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/errorUtils';
import Link from 'next/link';
import styles from '../../styles/Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in");
            router.push('/profile');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setError(errorMessage); // Assign error to state
            handleError(error, "Login"); // Log error
        }
    };

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            {error && <p className={styles.error}>{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>Don&apos;t have an account? <Link href="/auth/register" className={styles.link}>Register here</Link></p>
        </div>
    );
};

export default Login;
