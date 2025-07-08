/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext } from 'react';
import { useContext, useMemo } from 'react';
import React from 'react';

// Define default URLs and keys (you can move these to a constants file)
const API_URL = 'https://catalog-service.adobe.io/graphql';
const TEST_URL = 'https://catalog-service-sandbox.adobe.io/graphql';
const SANDBOX_KEY = 'storefront-widgets'; // Replace with your actual sandbox key if needed

const StoreContext = createContext({
  environmentId: '',
  environmentType: '',
  websiteCode: '',
  storeCode: '',
  storeViewCode: '',
  apiUrl: '',
  apiKey: '',
  config: {},
  context: {},
  route: undefined,
  searchQuery: 'q',
});

const StoreContextProvider = ({
  children,
  environmentId,
  environmentType,
  websiteCode,
  storeCode,
  storeViewCode,
  config,
  context,
  apiKey,
  route,
  searchQuery = 'q',
}) => {
  const storeProps = useMemo(() => {
    const isTesting = environmentType?.toLowerCase() === 'testing';
    return {
      environmentId,
      environmentType,
      websiteCode,
      storeCode,
      storeViewCode,
      config,
      context: {
        //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
        // customerGroup: context?.customerGroup ?? '',
        // userViewHistory: context?.userViewHistory ?? [],

        //workaround
        customerGroup: context && context.customerGroup != null ? context.customerGroup : '',
        userViewHistory: context && context.userViewHistory != null ? context.userViewHistory : [],
      },
      apiUrl: isTesting ? TEST_URL : API_URL,
      apiKey: isTesting && !apiKey ? SANDBOX_KEY : apiKey,
      route,
      searchQuery,
    };
  }, [
    environmentId,
    environmentType,
    websiteCode,
    storeCode,
    storeViewCode,
    config,
    context,
    apiKey,
    route,
    searchQuery,
  ]);

  return (
    <StoreContext.Provider value={storeProps}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  return useContext(StoreContext);
};

export { StoreContextProvider, useStore };
