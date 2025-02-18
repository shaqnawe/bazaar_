import ProductList from '../components/ProductList/ProductList';
import styles from '../components/ProductList/ProductList.module.css';

import { Product } from '@/types/product';
import { fetchProducts } from '../lib/products';

export default async function ProductsPage() {
    const products: Product[] = await fetchProducts();

    return (
        <div className={styles.productListContainer}>
            <h1>Products</h1>
            <ProductList products={products} />
        </div>
    );
}
