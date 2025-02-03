import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../app/lib/firebase';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
}

// Add an item to favorites
export const addToFavorites = async (product: Product) => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to add favorites.");
        return;
    }
    try {
        const favRef = doc(db, `users/${user.uid}/favorites`, product.id);
        const favSnap = await getDoc(favRef);
        if (!favSnap.exists()) {
            await setDoc(favRef, {
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl || '/static/images/default.jpg'
            });
            console.log("Item added to favorites!");
        } else {
            console.log("Item already in favorites");
        }
    } catch (error) {
        console.error("Error adding to favorites:", error);
    }
};

// Remove an item from favorites
export const removeFromFavorites = async (productId: string) => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to remove favorites.");
        return;
    }
    try {
        const favRef = doc(db, `users/${user.uid}/favorites`, productId);
        await deleteDoc(favRef);
        console.log("Item removed from favorites!");
    } catch (error) {
        console.error("Error removing item from favorites:", error);
    }
};
