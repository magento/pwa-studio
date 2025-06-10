/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import './ProductCardShimmer.css';

export const ProductCardShimmer = () => {
  return (
    <div className="ds-sdk-product-item ds-sdk-product-item--shimmer">
      <div className="ds-sdk-product-item__banner shimmer-animation-card" />
      <div className="ds-sdk-product-item__content">
        <div className="ds-sdk-product-item__header">
          <div className="ds-sdk-product-item__title shimmer-animation-card" />
        </div>
        <div className="ds-sdk-product-item__list shimmer-animation-card" />
        <div className="ds-sdk-product-item__info shimmer-animation-card" />
      </div>
    </div>
  );
};

export default ProductCardShimmer;
