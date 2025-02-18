import { Product } from '@/types/product';

export type CartItem = Pick<Product, 'id' | 'name' | 'price'> & {
    quantity: number;
    imageUrl?: string;
};
