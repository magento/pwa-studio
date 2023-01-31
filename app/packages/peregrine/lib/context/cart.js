import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { useMutation } from '@apollo/client';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import actions from '../store/actions/cart/actions';
import * as asyncActions from '../store/actions/cart/asyncActions';
import bindActionCreators from '../util/bindActionCreators';
import { useEventListener } from '../hooks/useEventListener';
import BrowserPersistence from '../util/simplePersistence';
import DEFAULT_OPERATIONS from '../talons/CartPage/cartPage.gql';
import mergeOperations from '../util/shallowMerge';

const CartContext = createContext();

const isCartEmpty = cart => !cart || !cart.details.items || cart.details.items.length === 0;

const getTotalQuantity = items => items.reduce((total, item) => total + item.quantity, 0);

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS);

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

    const cartApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => {
        const derivedCartState = {
            ...cartState,
            isEmpty: isCartEmpty(cartState),
            derivedDetails
        };

        return [derivedCartState, cartApi];
    }, [cartApi, cartState, derivedDetails]);

    const { createCartMutation, IsUserAuthedQuery } = operations;
    const [fetchCartId] = useMutation(createCartMutation);
    const fetchIsUserAuthed = useAwaitQuery(IsUserAuthedQuery);

    // Storage listener to force a state update if cartId changes from another browser tab.
    const storageListener = useCallback(() => {
        const storage = new BrowserPersistence();
        const currentCartId = storage.getItem('cartId');
        const { cartId } = cartState;
        if (cartId && currentCartId && cartId !== currentCartId) {
            globalThis.location && globalThis.location.reload();
        }
    }, [cartState]);

    useEventListener(globalThis, 'storage', storageListener);

    useEffect(() => {
        // cartApi.getCartDetails initializes the cart if there isn't one.
        cartApi.getCartDetails({
            fetchCartId,
            fetchIsUserAuthed
        });
    }, [cartApi, fetchIsUserAuthed, fetchCartId]);

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
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
