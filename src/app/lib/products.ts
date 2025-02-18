import { Product, StripeProduct } from '@/types/product';

export async function fetchProducts(): Promise<Product[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/products`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const stripeProducts: StripeProduct[] = await res.json(); // ✅ Now TypeScript knows the structure

    return stripeProducts.map((product: StripeProduct): Product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.default_price?.unit_amount ?? 0, // ✅ Ensures unit_amount is handled correctly
        currency: product.default_price?.currency || 'USD',
        imageUrl: product.images?.[0] || '/static/images/avatar.jpg',
        createdAt: product.created,
        updatedAt: product.updated,
        active: product.active,
    }));
}
