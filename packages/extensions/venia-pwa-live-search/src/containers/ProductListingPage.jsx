/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import { validateStoreDetailsKeys } from '../utils/validateStoreDetails';

import '../styles/global.css';

import {
  AttributeMetadataProvider,
  CartProvider,
  ProductsContextProvider,
  SearchProvider,
  StoreContextProvider,
} from '../context';
import Resize from '../context/displayChange';
import Translation from '../context/translation';
import { getUserViewHistory } from '../utils/getUserViewHistory';
import App from './App';

/**
 * A plug-and-play React component that provides the full Live Search PLP context.
 * @param {object} props
 * @param {object} props.storeDetails - Store configuration data (must include context).
 */
const ProductListingPage = ({ storeDetails }) => {
  if (!storeDetails) {
    throw new Error("LiveSearchPLP's storeDetails prop was not provided");
  }

  const userViewHistory = getUserViewHistory();

  const updatedStoreDetails = {
    ...storeDetails,
    context: {
      ...storeDetails.context,
      userViewHistory,
    },
  };

  return (
    <StoreContextProvider {...validateStoreDetailsKeys(updatedStoreDetails)}>
      <AttributeMetadataProvider>
        <SearchProvider>
          <Resize>
            <Translation>
              <ProductsContextProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </ProductsContextProvider>
            </Translation>
          </Resize>
        </SearchProvider>
      </AttributeMetadataProvider>
    </StoreContextProvider>
  );
};

export default ProductListingPage;
