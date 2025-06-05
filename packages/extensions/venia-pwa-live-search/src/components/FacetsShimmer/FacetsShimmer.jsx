import React from 'react';
import styles from './FacetsShimmer.css';

export const FacetsShimmer = () => {
  return (
    <>
      <div className={`${styles['ds-sdk-input']} ${styles['ds-sdk-input--loading']}`}>
        <div className={styles['ds-sdk-input__content']}>
          <div className={styles['ds-sdk-input__header']}>
            <div className={`${styles['ds-sdk-input__title']} ${styles['shimmer-animation-facet']}`} />
          </div>
          <div className={styles['ds-sdk-input__list']}>
            <div className={`${styles['ds-sdk-input__item']} ${styles['shimmer-animation-facet']}`} />
            <div className={`${styles['ds-sdk-input__item']} ${styles['shimmer-animation-facet']}`} />
            <div className={`${styles['ds-sdk-input__item']} ${styles['shimmer-animation-facet']}`} />
            <div className={`${styles['ds-sdk-input__item']} ${styles['shimmer-animation-facet']}`} />
          </div>
        </div>
      </div>
      <div className={`${styles['ds-sdk-input__border']} ${styles['border-t']} ${styles['mt-md']} ${styles['border-gray-200']}`} />
    </>
  );
};

//export default FacetsShimmer;
