import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingMethod.module.css';

const ShippingMethod = props => {
    const { data, classes: propsClasses } = props;
    const { shipments, shippingMethod } = data;
    const classes = useStyle(defaultClasses, propsClasses);
    let trackingElement;
    const method = shippingMethod.split('-');

    if (shipments.length) {
        trackingElement = shipments.map(shipment => {
            const { tracking: trackingCollection } = shipment;
            if (trackingCollection.length) {
                return trackingCollection.map(tracking => {
                    const { number } = tracking;

                    return (
                        <span className={classes.trackingRow} key={number}>
                            <FormattedMessage
                                id="orderDetails.trackingInformation"
                                defaultMessage="<strong>Tracking number:</strong> {number}"
                                values={{
                                    number,
                                    strong: chunks => <strong>{chunks}</strong>
                                }}
                            />
                        </span>
                    );
                });
            }
        });
    } else {
        trackingElement = (
            <FormattedMessage id="orderDetails.waitingOnTracking" defaultMessage="Waiting for tracking information" />
        );
    }

    return (
        <div className={classes.root} data-cy="OrderDetails-ShippingMethod-root">
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.shippingMethodLabel" defaultMessage="Shipping Method" />
            </div>
            <div className={classes.methodDetails}>
                <div className={classes.method}>
                    <span>{method[0].slice(0, method[0].length - 1)}:</span>
                    <span className={classes.methodValue}>{method[1]}</span>
                    {/* {shippingMethod} */}
                </div>
                <div className={classes.tracking}>{trackingElement}</div>
            </div>
        </div>
    );
};

export default ShippingMethod;

ShippingMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        method: string,
        tracking: string,
        trackingRow: string
    }),
    data: shape({
        shippingMethod: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        )
    })
};
