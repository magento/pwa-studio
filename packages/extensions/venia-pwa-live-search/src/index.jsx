/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

//import { render } from 'react'; // Ensure we're using React
import React from 'react';

import './styles/index.css';

import { getUserViewHistory } from '../src/utils/getUserViewHistory';
import App from './containers/App';
import {
  AttributeMetadataProvider,
  CartProvider,
  ProductsContextProvider,
  SearchProvider,
  StoreContextProvider,
} from './context/';
import Resize from './context/displayChange';
import Translation from './context/translation';
import { validateStoreDetailsKeys } from './utils/validateStoreDetails';

/**
 * @param {{ storeDetails: object }} props
 */
const LiveSearchPLP = ({ storeDetails }) => {
  if (!storeDetails) {
    throw new Error("Livesearch PLP's storeDetails prop was not provided");
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

export default LiveSearchPLP;
