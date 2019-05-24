import React, { Suspense } from 'react';
import { bool, object, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Checkout from 'src/components/Checkout';
import CheckoutButton from 'src/components/Checkout/checkoutButton';

import defaultClasses from './footer.css';
import TotalsSummary from './totalsSummary';

const Footer = props => {
    const { cart, isCartEmpty, isMiniCartMaskOpen } = props;
    const { isEditingItem, isLoading } = cart;

    const classes = mergeClasses(defaultClasses, props.classes);
    const footerClassName = isMiniCartMaskOpen
        ? classes.root_open
        : classes.root;
    const placeholderButton = (
        <div className={classes.placeholderButton}>
            <CheckoutButton ready={false} />
        </div>
    );

    if (isCartEmpty || isLoading || isEditingItem) {
        return null;
    }

    return (
        <div className={footerClassName}>
            <TotalsSummary cart={cart} />
            <Suspense fallback={placeholderButton}>
                <Checkout cart={cart} />
            </Suspense>
        </div>
    );
};

Footer.propTypes = {
    cart: shape({
        isEditingItem: bool,
        isLoading: bool
    }).isRequired,
    classes: shape({
        placeholderButton: string,
        root: string,
        root_open: string,
        summary: string
    }),
    isCartEmpty: bool,
    isMiniCartMaskOpen: bool
};

export default Footer;
