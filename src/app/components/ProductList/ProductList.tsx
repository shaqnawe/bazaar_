'use client';

import { Product } from '@/types/product';
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
    products: Product[];
}
const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className={styles.productListContainer}>
            <h2>Products</h2>
            <div className={styles.productGrid}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
