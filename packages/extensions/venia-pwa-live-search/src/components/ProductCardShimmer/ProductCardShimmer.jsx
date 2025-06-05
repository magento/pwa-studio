/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import styles from './ProductCardShimmer.css';

export const ProductCardShimmer = () => {
  return (
    <div className={`${styles['ds-sdk-product-item']} ${styles['ds-sdk-product-item--shimmer']}`}>
      <div className={`${styles['ds-sdk-product-item__banner']} ${styles['shimmer-animation-card']}`} />
      <div className={styles['ds-sdk-product-item__content']}>
        <div className={styles['ds-sdk-product-item__header']}>
          <div className={`${styles['ds-sdk-product-item__title']} ${styles['shimmer-animation-card']}`} />
        </div>
        <div className={`${styles['ds-sdk-product-item__list']} ${styles['shimmer-animation-card']}`} />
        <div className={`${styles['ds-sdk-product-item__info']} ${styles['shimmer-animation-card']}`} />
      </div>
    </div>
  );
};

export default ProductCardShimmer;
