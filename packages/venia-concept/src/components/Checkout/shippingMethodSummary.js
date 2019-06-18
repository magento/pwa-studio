import React, { Fragment } from 'react';
import { bool, shape, string } from 'prop-types';

const ShippingMethodSummary = props => {
    const { classes, hasShippingMethod, shippingTitle } = props;

    if (!hasShippingMethod) {
        return (
            <span className={classes.informationPrompt}>
                Specify Shipping Method
            </span>
        );
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
    }),
    hasShippingMethod: bool,
    shippingTitle: string
};

export default ShippingMethodSummary;
