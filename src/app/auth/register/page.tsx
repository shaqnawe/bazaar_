'use client';

import React, { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/errorUtils';
import Link from 'next/link';
import styles from '../../styles/Auth.module.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date(),
            });

            console.log("User registered:", user);
            router.push('/profile');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            // Assign error to state
            setError(errorMessage);
            // Log error
            handleError(error, "Login");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Register</h1>
            {error && <p className={styles.error}>{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            <p>Already have an account? <Link href="/auth/login" className={styles.link}>Login here</Link></p>
        </div>
    );
};

export default Register;
