import React, { Suspense } from 'react';
import { bool, object, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Checkout from 'src/components/Checkout';
import CheckoutButton from 'src/components/Checkout/checkoutButton';

import defaultClasses from './productListFooter.css';
import TotalsSummary from './totalsSummary';

const ProductListFooter = props => {
    // Props.
    const { cart, isMiniCartMaskOpen } = props;

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const footerClassName = isMiniCartMaskOpen
        ? classes.root_open
        : classes.root;
    const placeholderButton = (
        <div className={classes.placeholderButton}>
            <CheckoutButton ready={false} />
        </div>
    );

    return (
        <div className={footerClassName}>
            <TotalsSummary cart={cart} />
            <Suspense fallback={placeholderButton}>
                <Checkout cart={cart} />
            </Suspense>
        </div>
    );
};

ProductListFooter.propTypes = {
    cart: object,
    classes: shape({
        placeholderButton: string,
        root: string,
        root_open: string,
        summary: string
    }),
    isMiniCartMaskOpen: bool
};

export default ProductListFooter;
