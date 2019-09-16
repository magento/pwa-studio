import React, { useCallback, useState } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';

import Body from './body';
import Footer from './footer';
import Header from './header';
import Mask from './mask';
import defaultClasses from './miniCart.css';

import { mergeClasses } from '../../classify';
import getCurrencyCode from '../../util/getCurrencyCode';

const MiniCart = props => {
    const [step, setStep] = useState('cart');
    // Props.
    const {
        cancelCheckout,
        cart,
        closeDrawer,
        isCartEmpty,
        isOpen,
        removeItemFromCart,
        updateItemInCart
    } = props;

    const { isLoading, isUpdatingItem } = cart;

    const [isEditingItem, setIsEditingItem] = useState(false);

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const currencyCode = getCurrencyCode(cart);
    const cartItems = cart.details.items;
    const numItems = cart.details.items_qty;
    const rootClass = isOpen ? classes.root_open : classes.root;
    const subtotal = cart.totals.subtotal;

    const showFooter =
        step === 'receipt' ||
        step === 'form' ||
        !((isCartEmpty && step === 'cart') || isLoading || isEditingItem);

    const isMiniCartMaskOpen = step === 'form';

    const handleClose = useCallback(() => {
        setStep('cart');
        setIsEditingItem(false);
        closeDrawer();
    }, [closeDrawer, setStep]);

    const handleBeginEditItem = useCallback(() => {
        setIsEditingItem(true);
    }, []);

    const handleEndEditItem = useCallback(() => {
        setIsEditingItem(false);
    }, []);

    const handleUpdateItemInCart = useCallback(
        async (...args) => {
            try {
                await updateItemInCart(...args);
            } catch (error) {
                console.log('Unable to update item:', error.message);
            } finally {
                setIsEditingItem(false);
            }
        },
        [updateItemInCart]
    );

    const handleDismiss = useCallback(() => {
        setStep('cart');
        cancelCheckout();
    }, [cancelCheckout]);

    const footer = showFooter ? (
        <Footer
            cart={cart}
            currencyCode={currencyCode}
            isMiniCartMaskOpen={isMiniCartMaskOpen}
            numItems={numItems}
            setStep={setStep}
            step={step}
            subtotal={subtotal}
        />
    ) : null;

    return (
        <aside className={rootClass}>
            <Header closeDrawer={handleClose} isEditingItem={isEditingItem} />
            <Body
                beginEditItem={handleBeginEditItem}
                cartItems={cartItems}
                closeDrawer={handleClose}
                currencyCode={currencyCode}
                endEditItem={handleEndEditItem}
                isCartEmpty={isCartEmpty}
                isEditingItem={isEditingItem}
                isLoading={isLoading}
                isUpdatingItem={isUpdatingItem}
                removeItemFromCart={removeItemFromCart}
                updateItemInCart={handleUpdateItemInCart}
            />
            <Mask isActive={isMiniCartMaskOpen} dismiss={handleDismiss} />
            {footer}
        </aside>
    );
};

MiniCart.propTypes = {
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
    isCartEmpty: bool,
    isOpen: bool,
    removeItemFromCart: func,
    updateItemInCart: func
};

export default MiniCart;
