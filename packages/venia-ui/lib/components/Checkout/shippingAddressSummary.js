import React, { Fragment } from 'react';
import { array, bool, shape, string } from 'prop-types';

import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';

import isObjectEmpty from '../../util/isObjectEmpty';

const ShippingAddressSummary = props => {
    const { classes } = props;

    const [{ shippingAddress }] = useCheckoutContext();
    const hasShippingAddress =
        !!shippingAddress && !isObjectEmpty(shippingAddress);

    if (!hasShippingAddress) {
        return (
            <span className={classes.informationPrompt}>
                Add Shipping Information
            </span>
        );
    }

    const name = `${shippingAddress.firstname} ${shippingAddress.lastname}`;
    const street = shippingAddress.street.join(' ');

    return (
        <Fragment>
            <strong>{name}</strong>
            <br />
            <span>{street}</span>
        </Fragment>
    );
};

ShippingAddressSummary.propTypes = {
    classes: shape({
        informationPrompt: string
    }),
    hasShippingAddress: bool,
    shippingAddress: shape({
        firstName: string,
        lastName: string,
        street: array
    })
};

export default ShippingAddressSummary;
