/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useContext, useState } from 'react';
import { getGraphQL } from '../api/graphql';
import { ADD_TO_CART } from '../api/mutations';
import { GET_CUSTOMER_CART } from '../api/queries';
import { useProducts } from './products';
import { useStore } from './store';

// Removed TypeScript interface and type annotations

const CartContext = createContext({});

const useCart = () => {
    return useContext(CartContext);
};

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ cartId: '' });
    const { refreshCart, resolveCartId } = useProducts();
    const { storeViewCode, config } = useStore();

    //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
    // const initializeCustomerCart = async () => {
    //   let cartId = '';
    //   if (!resolveCartId) {
    //     const customerResponse = await getGraphQL(
    //       GET_CUSTOMER_CART,
    //       {},
    //       storeViewCode,
    //       config?.baseUrl
    //     );
    //     cartId = customerResponse?.data.customerCart?.id ?? '';
    //   } else {
    //     cartId = (await resolveCartId()) ?? '';
    //   }
    //   setCart({ ...cart, cartId });
    //   return cartId;
    // };

    //workaround
    const initializeCustomerCart = async () => {
        let cartId = '';
        if (!resolveCartId) {
            const customerResponse = await getGraphQL(
                GET_CUSTOMER_CART,
                {},
                storeViewCode,
                config && config.baseUrl
            );

            cartId =
                customerResponse &&
                customerResponse.data &&
                customerResponse.data.customerCart &&
                customerResponse.data.customerCart.id
                    ? customerResponse.data.customerCart.id
                    : '';
        } else {
            const resolvedCartId = await resolveCartId();
            cartId = resolvedCartId != null ? resolvedCartId : '';
        }

        setCart({ ...cart, cartId });
        return cartId;
    };

    const addToCartGraphQL = async sku => {
        let cartId = cart.cartId;
        if (!cartId) {
            cartId = await initializeCustomerCart();
        }
        const cartItems = [
            {
                quantity: 1,
                sku
            }
        ];

        const variables = {
            cartId,
            cartItems
        };

        const response = await getGraphQL(
            ADD_TO_CART,
            variables,
            storeViewCode,
            config?.baseUrl
        );

        return response;
    };

    const cartContext = {
        cart,
        initializeCustomerCart,
        addToCartGraphQL,
        refreshCart
    };

    return (
        <CartContext.Provider value={cartContext}>
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider, useCart };
