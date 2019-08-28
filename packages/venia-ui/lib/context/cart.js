import React, { createContext, useMemo } from 'react';

import {
    addItemToCart,
    beginEditItem,
    createCart,
    endEditItem,
    getCartDetails,
    removeItemFromCart,
    updateItemInCart
} from '../actions/cart';
import { connect } from '../drivers';

export const CartContext = createContext();

const CartContextProvider = props => {
    const {
        addItemToCart,
        beginEditItem,
        cart: cartState,
        children,
        createCart,
        endEditItem,
        getCartDetails,
        removeItemFromCart,
        updateItemInCart
    } = props;

    const cartApi = useMemo(
        () => ({
            addItemToCart,
            beginEditItem,
            createCart,
            endEditItem,
            getCartDetails,
            removeItemFromCart,
            updateItemInCart
        }),
        [
            addItemToCart,
            beginEditItem,
            createCart,
            endEditItem,
            getCartDetails,
            removeItemFromCart,
            updateItemInCart
        ]
    );

    const contextValue = useMemo(() => [cartState, cartApi], [
        cartApi,
        cartState
    ]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

const mapStateToProps = ({ cart }) => ({ cart });

const mapDispatchToProps = {
    addItemToCart,
    beginEditItem,
    createCart,
    endEditItem,
    getCartDetails,
    removeItemFromCart,
    updateItemInCart
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartContextProvider);
