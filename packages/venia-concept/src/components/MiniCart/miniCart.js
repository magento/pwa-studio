import React from 'react';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';

import Body from './body';
import Footer from './footer';
import Header from './header';
import Mask from './mask';
import defaultClasses from './miniCart.css';

import { mergeClasses } from 'src/classify';
import getCurrencyCode from 'src/util/getCurrencyCode';

const MiniCart = props => {
    // Props.
    const {
        beginEditItem,
        cancelCheckout,
        cart,
        closeDrawer,
        endEditItem,
        isCartEmpty,
        isMiniCartMaskOpen,
        isOpen,
        removeItemFromCart,
        updateItemInCart
    } = props;
    const { editItem, isEditingItem, isLoading, isUpdatingItem } = cart;

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const currencyCode = getCurrencyCode(cart);
    const cartItems = cart.details.items;
    const numItems = cart.details.items_qty;
    const rootClass = isOpen ? classes.root_open : classes.root;
    const subtotal = cart.totals.subtotal;

    const showFooter = !(isCartEmpty || isLoading || isEditingItem);
    const footer = showFooter ? (
        <Footer
            cart={cart}
            currencyCode={currencyCode}
            isMiniCartMaskOpen={isMiniCartMaskOpen}
            numItems={numItems}
            subtotal={subtotal}
        />
    ) : null;

    return (
        <aside className={rootClass}>
            <Header closeDrawer={closeDrawer} isEditingItem={isEditingItem} />
            <Body
                beginEditItem={beginEditItem}
                cartItems={cartItems}
                closeDrawer={closeDrawer}
                currencyCode={currencyCode}
                editItem={editItem}
                endEditItem={endEditItem}
                isCartEmpty={isCartEmpty}
                isEditingItem={isEditingItem}
                isLoading={isLoading}
                isUpdatingItem={isUpdatingItem}
                removeItemFromCart={removeItemFromCart}
                updateItemInCart={updateItemInCart}
            />
            <Mask isActive={isMiniCartMaskOpen} dismiss={cancelCheckout} />
            {footer}
        </aside>
    );
};

MiniCart.propTypes = {
    beginEditItem: func.isRequired,
    cancelCheckout: func,
    cart: shape({
        details: shape({
            currency: shape({
                quote_currency_code: string
            }),
            items: arrayOf(
                shape({
                    item_id: number,
                    name: string,
                    price: number,
                    product_type: string,
                    qty: number,
                    quote_id: string,
                    sku: string
                })
            ),
            items_qty: number
        }).isRequired,
        editItem: object,
        isEditingItem: bool,
        isLoading: bool,
        isUpdatingItem: bool,
        totals: shape({
            subtotal: number
        }).isRequired
    }).isRequired,
    classes: shape({
        header: string,
        root: string,
        root_open: string,
        title: string
    }),
    closeDrawer: func,
    endEditItem: func.isRequired,
    isCartEmpty: bool,
    isMiniCartMaskOpen: bool,
    isOpen: bool,
    removeItemFromCart: func,
    updateItemInCart: func
};

export default MiniCart;
