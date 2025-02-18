import { CartItem } from "@/types/cart";
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../app/lib/firebase";

// Add item to cart or increase quantity if already present.
export const addToCart = async (product: CartItem) => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to add items to the cart.");
        return;
    }

    try {
        const cartItemRef = doc(db, `users/${user.uid}/cart`, product.id);
        const cartItemSnap = await getDoc(cartItemRef);

        if (cartItemSnap.exists()) {
            // Update quantity if item already exists
            await setDoc(cartItemRef, {
                ...cartItemSnap.data(),
                quantity: cartItemSnap.data().quantity + 1
            }, { merge: true });
        } else {
            // Add new item
            await setDoc(cartItemRef, {
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl ?? "",
                quantity: 1,
                createdAt: new Date()
            });
        }
        console.log("Item added to cart!");
    } catch (error) {
        console.error("Error adding item to cart:", error);
    }
};

// Remove an item from the cart.
export const removeFromCart = async (itemId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await deleteDoc(doc(db, `users/${user.uid}/cart`, itemId));
        console.log("Item removed from cart.");
    } catch (error) {
        console.error("Error removing item:", error);
    }
};

// Update the quantity of an item in the cart.
export const updateCartItem = async (itemId: string, newQuantity: number) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const itemRef = doc(db, `users/${user.uid}/cart`, itemId);
        if (newQuantity > 0) {
            await setDoc(itemRef, { quantity: newQuantity }, { merge: true });
        } else {
            await deleteDoc(itemRef); // Remove if quantity is 0
        }
        console.log("Cart item updated.");
    } catch (error) {
        console.error("Error updating cart item:", error);
    }
};

// Fetch the user's cart in real-time.
export const getCartItems = (setCartData: (cart: CartItem[]) => void) => {
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = collection(db, `users/${user.uid}/cart`);
    return onSnapshot(cartRef, (snapshot) => {
        const items: CartItem[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as CartItem[];
        setCartData(items);
    });
};
