/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import styles from './ButtonShimmer.css';
import React from 'react';

export const ButtonShimmer = () => {
  return (
    <>
      <div className={`${styles['ds-plp-facets']} ${styles['ds-plp-facets--loading']}`}>
        <div className={`${styles['ds-plp-facets__button']} ${styles['shimmer-animation-button']}`} />
      </div>
    </>
  );
};

//export default ButtonShimmer;
