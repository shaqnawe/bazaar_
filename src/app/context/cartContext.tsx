'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUser } from "../context/AuthContext";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cartData: CartItem[];
    grandTotal: number;
    setCartData: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartData, setCartData] = useState<CartItem[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const { user, loading } = useUser();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            console.warn("⚠️ No authenticated user found. Cart will be empty.");
            setCartData([]);
            return;
        }

        console.log(`Listening for cart updates for user: ${user.uid}`);

        const cartRef = collection(db, `users/${user.uid}/cart`);

        const unsubscribe = onSnapshot(cartRef, (snapshot) => {
            if (!snapshot.empty) {
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as CartItem[];

                console.log("🔥 Firestore Cart Data Updated:", items);
                setCartData(items);
            } else {
                console.warn("⚠️ Firestore Cart is empty.");
                setCartData([]);
            }
        });

        return () => unsubscribe();
    }, [user, loading]);

    useEffect(() => {
        const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setGrandTotal(total);
    }, [cartData]);

    return (
        <CartContext.Provider value={{ cartData, grandTotal, setCartData }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
