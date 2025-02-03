'use client';

import ProductList from '../components/ProductList/ProductList';
import styles from '../components/ProductList/ProductList.module.css';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
}

const products: Product[] = [
    { id: "1", name: "Laptop", price: 999.99, imageUrl: "/static/images/avatar.jpg" },
    { id: "2", name: "Headphones", price: 49.99, imageUrl: "/static/images/avatar.jpg" },
    { id: "3", name: "Smartphone", price: 799.99, imageUrl: "/static/images/avatar.jpg" },
    { id: "4", name: "Keyboard", price: 69.99, imageUrl: "/static/images/avatar.jpg" },
    { id: "5", name: "Monitor", price: 199.99, imageUrl: "/static/images/avatar.jpg" },
    { id: "6", name: "Gaming Mouse", price: 59.99, imageUrl: "/static/images/avatar.jpg" }
];

const ProductList_ = () => {
    return (
        <div className={styles.productListContainer}>
            <ProductList products={products} />
        </div>
    );
};

export default ProductList_;
