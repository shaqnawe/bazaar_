'use client';
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

interface Product {
    id: string;
    name: string;
    price: number;
}

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
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
