/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getGraphQL } from '../api/graphql';
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../api/mutations';
import { GET_CUSTOMER_WISHLISTS } from '../api/queries';
import { useStore } from './store';

// Default values for WishlistContext
const WishlistContext = createContext({});

const useWishlist = () => {
  return useContext(WishlistContext);
};

const WishlistProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allWishlist, setAllWishlist] = useState([]);
  const [wishlist, setWishlist] = useState();
  const { storeViewCode, config } = useStore();

  useEffect(() => {
    getWishlists();
  }, []);

  const getWishlists = async () => {
    const { data } =
      (await getGraphQL(
        GET_CUSTOMER_WISHLISTS,
        {},
        storeViewCode,
        config?.baseUrl
      )) || {};
    const wishlistResponse = data?.customer;
    const isAuthorized = !!wishlistResponse;

    setIsAuthorized(isAuthorized);
    if (isAuthorized) {
      const firstWishlist = wishlistResponse.wishlists[0];
      setWishlist(firstWishlist);
      setAllWishlist(wishlistResponse.wishlists);
    }
  };

  const addItemToWishlist = async (wishlistId, wishlistItem) => {
    const { data } =
      (await getGraphQL(
        ADD_TO_WISHLIST,
        {
          wishlistId,
          wishlistItems: [wishlistItem],
        },
        storeViewCode,
        config?.baseUrl
      )) || {};
    const wishlistResponse = data?.addProductsToWishlist.wishlist;
    setWishlist(wishlistResponse);
  };

  const removeItemFromWishlist = async (wishlistId, wishlistItemsIds) => {
    const { data } =
      (await getGraphQL(
        REMOVE_FROM_WISHLIST,
        {
          wishlistId,
          wishlistItemsIds: [wishlistItemsIds],
        },
        storeViewCode,
        config?.baseUrl
      )) || {};
    const wishlistResponse = data?.removeProductsFromWishlist.wishlist;
    setWishlist(wishlistResponse);
  };

  const wishlistContext = {
    isAuthorized,
    wishlist,
    allWishlist,
    addItemToWishlist,
    removeItemFromWishlist,
  };

  return (
    <WishlistContext.Provider value={wishlistContext}>
      {children}
    </WishlistContext.Provider>
  );
};

export { useWishlist, WishlistProvider };
