import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingMethod.css';

const ShippingMethod = props => {
    const { data, classes: propsClasses } = props;
    const { shipments, shippingMethod } = data;
    const classes = mergeClasses(defaultClasses, propsClasses);
    /**
     * Shipments and Tracking are arrays. Since Venia does not
     * support multiple shipping addresses in checkout we will
     * be picking the first value in those arrays for now.
     */
    let trackingElement;
    if (shipments.length) {
        const [{ tracking }] = shipments;
        const [{ carrier, number }] = tracking;

        trackingElement = (
            <FormattedMessage
                id="orderDetails.trackingInformation"
                values={{
                    carrier,
                    number
                }}
            />
        );
    } else {
        trackingElement = (
            <FormattedMessage
                id="orderDetails.waitingOnTracking"
                defaultMessage="Waiting for tracking information"
            />
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.shippingMethodLabel"
                    defaultMessage="Shipping Method"
                />
            </div>
            <div className={classes.method}>{shippingMethod}</div>
            <div className={classes.tracking}>{trackingElement}</div>
        </div>
    );
};

export default ShippingMethod;

ShippingMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        method: string,
        tracking: string
    }),
    data: shape({
        shippingMethod: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        carrier: string,
                        number: string
                    })
                )
            })
        )
    })
};
