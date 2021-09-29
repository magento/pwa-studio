import React, { Suspense } from 'react';
import { bool, number, object, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import Checkout from '../Checkout';
import CheckoutButton from '../Checkout/checkoutButton';

import defaultClasses from './footer.module.css';
import TotalsSummary from './totalsSummary';

const Footer = props => {
    const {
        currencyCode,
        isMiniCartMaskOpen,
        numItems,
        setStep,
        step,
        subtotal
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const footerClassName = isMiniCartMaskOpen
        ? classes.root_open
        : classes.root;
    const placeholderButton = (
        <div className={classes.placeholderButton}>
            <CheckoutButton disabled={true} />
        </div>
    );

    return (
        <div className={footerClassName}>
            <TotalsSummary
                currencyCode={currencyCode}
                numItems={numItems}
                subtotal={subtotal}
            />
            <Suspense fallback={placeholderButton}>
                <Checkout setStep={setStep} step={step} />
            </Suspense>
        </div>
    );
};

Footer.propTypes = {
    cart: object,
    classes: shape({
        placeholderButton: string,
        root: string,
        root_open: string,
        summary: string
    }),
    currencyCode: string,
    isMiniCartMaskOpen: bool,
    numItems: number,
    subtotal: number
};

export default Footer;
