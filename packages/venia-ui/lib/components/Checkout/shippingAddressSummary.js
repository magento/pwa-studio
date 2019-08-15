import React, { Fragment } from 'react';
import { array, bool, shape, string } from 'prop-types';

const ShippingAddressSummary = props => {
    const { classes, hasShippingAddress, shippingAddress } = props;

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
