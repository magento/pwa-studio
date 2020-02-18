import React, { createContext, useContext, useMemo } from 'react';
import { connect } from 'react-redux';

import actions from '../store/actions/cart/actions';
import * as asyncActions from '../store/actions/cart/asyncActions';
import bindActionCreators from '../util/bindActionCreators';

const CartContext = createContext();

const isCartEmpty = cart =>
    !cart || !cart.details.items || cart.details.items.length === 0;

const getTotalQuantity = items =>
    items.reduce((total, item) => total + item.quantity, 0);

const CartContextProvider = props => {
    const { actions, asyncActions, cartState, children } = props;

    // Make deeply nested details easier to retrieve and provide empty defaults
    const derivedDetails = useMemo(() => {
        if (isCartEmpty(cartState)) {
            return {
                appliedTaxes: [],
                discounts: null,
                numItems: 0,
                subtotalExcludingTax: 0,
                subtotalIncludingTax: 0,
                subtotalWithDiscountExcludingTax: 0,
                grandTotal: 0,
                currencyCode: 'USD',
            };
        } else {

            return {
                appliedTaxes: cartState.details.prices.applied_taxes,
                discounts: cartState.details.prices.discounts,
                numItems: getTotalQuantity(cartState.details.items),
                subtotalExcludingTax: cartState.details.prices.subtotal_excluding_tax.value,
                subtotalIncludingTax: cartState.details.prices.subtotal_including_tax.value,
                subtotalWithDiscountExcludingTax: cartState.details.prices.subtotal_with_discount_excluding_tax.value,
                grandTotal: cartState.details.prices.grand_total.value,
                currencyCode: cartState.details.prices.grand_total.currency,
            };
        }
    }, [cartState]);

    const derivedCartState = {
        ...cartState,
        isEmpty: isCartEmpty(cartState),
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
