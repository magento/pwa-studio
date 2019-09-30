import React, { useCallback, useState } from 'react';
import { bool, shape, string } from 'prop-types';

import Body from './body';
import Footer from './footer';
import Header from './header';
import Mask from './mask';
import defaultClasses from './miniCart.css';

import { mergeClasses } from '../../classify';
import getCurrencyCode from '../../util/getCurrencyCode';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';

const MiniCart = props => {
    const [, { closeDrawer }] = useAppContext();
    const [
        cartState,
        { updateItemInCart, removeItemFromCart }
    ] = useCartContext();
    const [, { cancelCheckout }] = useCheckoutContext();
    const [step, setStep] = useState('cart');

    // Props.
    const { isOpen } = props;

    const { isLoading, isUpdatingItem } = cartState;

    const [isEditingItem, setIsEditingItem] = useState(false);

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const currencyCode = getCurrencyCode(cartState);
    const cartItems = cartState.details.items;
    const numItems = cartState.details.items_qty;
    const rootClass = isOpen ? classes.root_open : classes.root;
    const subtotal = cartState.totals.subtotal;

    const showFooter =
        step === 'receipt' ||
        step === 'form' ||
        !((cartState.isEmpty && step === 'cart') || isLoading || isEditingItem);

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
                isCartEmpty={cartState.isEmpty}
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
    classes: shape({
        header: string,
        root: string,
        root_open: string,
        title: string
    }),
    isOpen: bool
};

export default MiniCart;
