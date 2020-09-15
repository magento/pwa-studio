import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingMethod.css';

const ShippingMethod = props => {
    const { data, classes: propsClasses } = props;
    const { shipments, shippingMethod } = data;
    const classes = mergeClasses(defaultClasses, propsClasses);
    /**
     * Shipments and Tracking are arrays. Since Venia does not
     * support multiple shipping arrdresses in checkout we will
     * be picking the first value in those arrays for now.
     */
    const [{ tracking }] = shipments;
    const [{ carrier, number }] = tracking;

    return (
        <div className={classes.root}>
            <div className={classes.heading}>{'Shipping Method'}</div>
            <div className={classes.method}>{shippingMethod}</div>
            <div className={classes.tracking}>
                {`${carrier} Tracking: ${number}`}
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
