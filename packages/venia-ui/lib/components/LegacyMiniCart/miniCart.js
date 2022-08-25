import React from 'react';
import { shape, string } from 'prop-types';

import { useLegacyMiniCart } from '@magento/peregrine/lib/talons/LegacyMiniCart/useLegacyMiniCart';

import Body from './body';
import Footer from './footer';
import Header from './header';
import Mask from './mask';
import defaultClasses from './miniCart.module.css';
import { useStyle } from '../../classify';

/**
 * @deprecated - use component/MiniCart instead
 */
const LegacyMiniCart = props => {
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
    } = useLegacyMiniCart();

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

    const classes = useStyle(defaultClasses, props.classes);
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

LegacyMiniCart.propTypes = {
    classes: shape({
        header: string,
        root: string,
        root_open: string,
        title: string
    })
};

export default LegacyMiniCart;
