import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';
import isObjectEmpty from '@magento/peregrine/lib/util/isObjectEmpty';

const ShippingMethodSummary = props => {
    const { classes } = props;

    const [
        { shippingAddress, shippingMethod, shippingTitle }
    ] = useCheckoutContext();

    const hasShippingAddress =
        !!shippingAddress && !isObjectEmpty(shippingAddress);

    const hasShippingMethod = !!shippingMethod;

    const className = hasShippingAddress
        ? classes.informationPrompt
        : classes.disabledPrompt;

    if (!hasShippingMethod) {
        return <span className={className}>Specify Shipping Method</span>;
    }

    return (
        <Fragment>
            <strong>{shippingTitle}</strong>
        </Fragment>
    );
};

ShippingMethodSummary.propTypes = {
    classes: shape({
        informationPrompt: string
    })
};

export default ShippingMethodSummary;
