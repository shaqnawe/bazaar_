export interface Product {
    id: string;
    name: string; // Alias for 'name' in Stripe response
    description?: string;
    price: number; // Alias for 'default_price.unit_amount'
    currency: string; // Alias for 'default_price.currency'
    imageUrl?: string; // Alias for 'images[0]'
    createdAt: number; // Alias for 'created'
    updatedAt: number; // Alias for 'updated'
    active: boolean;
}

export interface StripeProduct {
    id: string;
    name: string;
    description?: string;
    default_price: {
        unit_amount: number;
        currency?: string;
    };
    images?: string[];
    created: number;
    updated: number;
    active: boolean;
}
