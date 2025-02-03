'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from "firebase/auth";

interface UserContextType {
    user: User | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //Debugging log
        console.log("UserContext Mounted");

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("User state changed:", currentUser);
            setUser(currentUser);
            setLoading(false);
        });

        //Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
