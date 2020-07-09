import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import actions from '../store/actions/cart/actions';
import * as asyncActions from '../store/actions/cart/asyncActions';
import bindActionCreators from '../util/bindActionCreators';

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

export const GET_LOCAL_CART_ID = gql`
    query getCartId {
        # 'always: true' forces the local resolver to be used instead of the
        # cache. This is OK because we want custom logic for the lookup.
        cartId @client(always: true)
    }
`;

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    const [getLocalCartId, { data: localCartIdData }] = useLazyQuery(
        GET_LOCAL_CART_ID
    );
    const localCartId = localCartIdData && localCartIdData.cartId;

    useEffect(() => {
        if (!localCartId) {
            getLocalCartId();
        }
    }, [getLocalCartId, localCartId]);
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

    const derivedCartState = {
        ...cartState,
        isEmpty: isCartEmpty(cartState),
        derivedDetails,
        ...(localCartId ? { cartId: localCartId } : {})
    };

    const cartApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

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

export const CartContextResolvers = {
    Query: {
        cartId: async (root, args, context) => {
            try {
                console.group('In cartId resolver:');
                let cartId;
                try {
                    // Will throw if no data. Prevent this by defining initial value.
                    const cacheData = context.cache.readQuery({
                        query: GET_LOCAL_CART_ID
                    });
                    cartId = cacheData.cartId;
                    console.log('Got cached value:', cartId);
                } catch (err) {
                    console.log('No cached cart id, fetching from server');
                    const fetchedData = await context.client.mutate({
                        mutation: createCartMutation
                    });
                    cartId = fetchedData.data.cartId;
                    console.log('Got value from server:', cartId);
                }
                console.groupEnd();
                return cartId;
            } catch (err) {
                console.error(err);
            }
        }
    }
};
