'use client';

import { Product } from '@/types/product';
import Image from 'next/image';
import React from 'react';
import { addToCart } from '../../../utils/cartUtils';
import { addToFavorites } from '../../../utils/favoritesUtils';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = async () => {
    await addToCart({ ...product, quantity: 1 });
  };

  const handleAddToFavorites = async () => {
    await addToFavorites(product);
  };

  return (
    <div className={styles.productCard}>
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className={styles.productImage}
        />
      )}
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <div className={styles.actions}>
        <button onClick={handleAddToCart} className={styles.addToCartButton}>
          Add to Cart
        </button>
        <button onClick={handleAddToFavorites} className={styles.favButton}>
          <span className={styles.heartIcon}>❤️</span>
          <span className={styles.tooltip}>Add to Favorites</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
