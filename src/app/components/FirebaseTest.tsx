'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';

const FirebaseTest: React.FC = () => {
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            console.log("Current User:", currentUser);
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h1>Firebase Connection Test</h1>
            {user ? <p>Logged in as: {user.email}</p> : <p>No user logged in</p>}
        </div>
    );
};

export default FirebaseTest;
