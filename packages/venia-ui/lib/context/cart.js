import React, { createContext, useMemo } from 'react';
import { bindActionCreators } from 'redux';

import actions from '../actions/cart/actions';
import * as asyncActions from '../actions/cart/asyncActions';
import { connect } from '../drivers';

export const CartContext = createContext();

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    const cartApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
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

const mapStateToProps = ({ cart }) => ({ cartState: cart });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartContextProvider);
