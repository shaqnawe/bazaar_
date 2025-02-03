'use client';

import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { updatePassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/errorUtils';
import styles from './UpdatePassword.module.css';

const UpdatePassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
                setMessage('Password updated successfully.');
                // Optionally redirect after a short delay
                setTimeout(() => {
                    router.push('/profile');
                }, 2000);
            } else {
                setError('No authenticated user found.');
            }
        } catch (error) {
            handleError(error)
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Update Password</h1>
            <form className={styles.form} onSubmit={handleUpdatePassword}>
                <label htmlFor="newPassword" className={styles.label}>New Password</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    required
                />

                <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    required
                />

                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.success}>{message}</p>}

                <button type="submit" className={styles.button}>Update Password</button>
            </form>
        </div>
    );
};

export default UpdatePassword;
