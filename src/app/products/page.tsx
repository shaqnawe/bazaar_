'use client';

import React from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from '../components/ProductList/ProductList.module.css';

const products = [
    { id: "1", name: "Laptop", price: 999.99 },
    { id: "2", name: "Headphones", price: 49.99 },
    { id: "3", name: "Smartphone", price: 799.99 },
    { id: "4", name: "Keyboard", price: 69.99 },
    { id: "5", name: "Monitor", price: 199.99 },
    { id: "6", name: "Gaming Mouse", price: 59.99 }
];

const ProductList = () => {
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
