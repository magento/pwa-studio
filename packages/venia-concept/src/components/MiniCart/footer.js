import React, { Suspense } from 'react';
import { bool, object, shape, string } from 'prop-types';

import Checkout from 'src/components/Checkout';
import CheckoutButton from 'src/components/Checkout/checkoutButton';

import TotalsSummary from './totalsSummary';

const Footer = props => {
    // Props.
    const { cart, classes, isMiniCartMaskOpen } = props;

    // Members.
    const footerClassName = isMiniCartMaskOpen
        ? classes.footerMaskOpen
        : classes.footer;
    const placeholderButton = (
        <div className={classes.placeholderButton}>
            <CheckoutButton ready={false} />
        </div>
    );

    return (
        <div className={footerClassName}>
            <TotalsSummary cart={cart} classes={classes} />
            <Suspense fallback={placeholderButton}>
                <Checkout cart={cart} />
            </Suspense>
        </div>
    );
};

Footer.propTypes = {
    cart: object,
    classes: shape({
        footer: string,
        footerMaskOpen: string,
        placeholderButton: string,
        summary: string
    }),
    isMiniCartMaskOpen: bool
};

export default Footer;
