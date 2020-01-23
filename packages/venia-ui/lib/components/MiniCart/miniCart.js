import React from 'react';
import { shape, string } from 'prop-types';

import { useMiniCart } from '@magento/peregrine/lib/talons/MiniCart/useMiniCart';

import Body from './body';
import Footer from './footer';
import Header from './header';
import Mask from './mask';
import defaultClasses from './miniCart.css';
import { mergeClasses } from '../../classify';

const MiniCart = props => {
    const {
        cartItems,
        cartState,
        currencyCode,
        handleBeginEditItem,
        handleDismiss,
        handleEndEditItem,
        handleClose,
        isEditingItem,
        isLoading,
        isMiniCartMaskOpen,
        isOpen,
        isUpdatingItem,
        numItems,
        setStep,
        shouldShowFooter,
        step,
        subtotal
    } = useMiniCart();

    const footer = shouldShowFooter ? (
        <Footer
            currencyCode={currencyCode}
            isMiniCartMaskOpen={isMiniCartMaskOpen}
            numItems={numItems}
            setStep={setStep}
            step={step}
            subtotal={subtotal}
        />
    ) : null;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

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
    })
};

export default MiniCart;
