import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingMethod.css';

const ShippingMethod = props => {
    const { data, classes: propsClasses } = props;
    const { shipments, shippingMethod } = data;
    const classes = mergeClasses(defaultClasses, propsClasses);
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
