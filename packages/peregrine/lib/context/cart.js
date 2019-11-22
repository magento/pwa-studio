import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { connect } from 'react-redux';

import { useMutation } from '@apollo/react-hooks';

import actions from '../store/actions/cart/actions';
import * as asyncActions from '../store/actions/cart/asyncActions';
import bindActionCreators from '../util/bindActionCreators';
import gql from 'graphql-tag';

const CartContext = createContext();

const isCartEmpty = cart =>
    !cart || !cart.details.items || cart.details.items.length === 0;

const createCartMutation = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    const derivedCartState = {
        ...cartState,
        isEmpty: isCartEmpty(cartState)
    };

    const [getCartId] = useMutation(createCartMutation);

    const createCart = useCallback(async () => {
        const {
            data: { cartId }
        } = await getCartId();
        await asyncActions.setCartId(cartId);
    }, [asyncActions, getCartId]);

    const cartApi = useMemo(
        () => ({
            actions,
            ...asyncActions,
            createCart
        }),
        [actions, asyncActions, createCart]
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
