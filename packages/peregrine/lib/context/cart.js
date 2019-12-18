import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import actions from '../store/actions/cart/actions';
import * as asyncActions from '../store/actions/cart/asyncActions';
import bindActionCreators from '../util/bindActionCreators';

// TODO Where would we store this?
import GET_CART_DETAILS_QUERY from '../../../venia-ui/lib/queries/getCartDetails.graphql';

const CartContext = createContext();

const isCartEmpty = cart => !cart || !cart.items || cart.items.length === 0;

const getTotalQuantity = items =>
    items.reduce((total, item) => total + item.quantity, 0);

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    const { cartId } = cartState;
    const [fetchCartDetails, { data = {} }] = useLazyQuery(
        GET_CART_DETAILS_QUERY
    );

    useEffect(() => {
        if (cartId) {
            fetchCartDetails({
                variables: { cartId }
            });
        }
    }, [cartId, fetchCartDetails]);

    // Make deeply nested details easier to retrieve and provide empty defaults
    const derivedDetails = useMemo(() => {
        if (isCartEmpty(data.cart)) {
            return {
                currencyCode: 'USD',
                numItems: 0,
                subtotal: 0
            };
        } else {
            return {
                currencyCode: data.cart.prices.grand_total.currency,
                numItems: getTotalQuantity(data.cart.items),
                subtotal: data.cart.prices.grand_total.value
            };
        }
    }, [data.cart]);

    const derivedCartState = {
        ...cartState,
        isEmpty: isCartEmpty(data.cart),
        details: (data && data.cart) || {},
        derivedDetails
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
