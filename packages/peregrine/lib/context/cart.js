import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import actions from '../store/actions/cart/actions';
import * as asyncActions from '../store/actions/cart/asyncActions';
import bindActionCreators from '../util/bindActionCreators';
import { BrowserPersistence } from '../util';

const CartContext = createContext();

const isCartEmpty = cart =>
    !cart || !cart.details.items || cart.details.items.length === 0;

const getTotalQuantity = items =>
    items.reduce((total, item) => total + item.quantity, 0);

const createCartMutation = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;

const storage = new BrowserPersistence();

function retrieveCartId() {
    return storage.getItem('cartId');
}

function saveCartId(id) {
    return storage.setItem('cartId', id);
}

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    const [fetchCartId, { data }] = useMutation(createCartMutation, {
        fetchPolicy: 'no-cache'
    });

    // Make deeply nested details easier to retrieve and provide empty defaults
    const derivedDetails = useMemo(() => {
        if (isCartEmpty(cartState)) {
            return {
                currencyCode: 'USD',
                numItems: 0,
                subtotal: 0
            };
        } else {
            return {
                currencyCode: cartState.details.prices.grand_total.currency,
                numItems: getTotalQuantity(cartState.details.items),
                subtotal: cartState.details.prices.grand_total.value
            };
        }
    }, [cartState]);

    const storageCartId = retrieveCartId();

    const derivedCartState = {
        ...cartState,
        isEmpty: isCartEmpty(cartState),
        derivedDetails,
        ...(storageCartId ? { cartId: storageCartId } : {})
    };

    const cartApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    // cartId stored in local storage and set on cart context (instead of reducer value). Alternatively could use an @client query for the value.
    useEffect(() => {
        if (data && data.cartId) {
            saveCartId(data.cartId);
        }
    }, [cartApi, data]);

    useEffect(() => {
        if (!storageCartId) {
            fetchCartId();
        }
    }, [data, fetchCartId, storageCartId]);

    const contextValue = useMemo(() => [derivedCartState, cartApi], [
        cartApi,
        derivedCartState
    ]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

const mapStateToProps = ({ cart }) => ({ cartState: cart });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartContextProvider);

export const useCartContext = () => useContext(CartContext);
