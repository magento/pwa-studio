import React, { createContext, useContext, useMemo } from 'react';
import { connect } from 'react-redux';

import actions from '../store/actions/cart/actions';
import * as asyncActions from '../store/actions/cart/asyncActions';
import bindActionCreators from '../util/bindActionCreators';

const CartContext = createContext();

const isCartEmpty = cart =>
    !cart || !cart.details.items || cart.details.items.length === 0;

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    const derivedCartState = {
        ...cartState,
        isEmpty: isCartEmpty(cartState)
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
