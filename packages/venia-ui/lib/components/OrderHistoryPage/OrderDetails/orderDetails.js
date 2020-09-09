import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import ShippingInformation from './shippingInformation';
import ShippingMethod from './shippingMethod';

import defaultClasses from './orderDetails.css';

const OrderDetails = props => {
    const {
        billing_address,
        items,
        order_date,
        order_total,
        payment_methods,
        shipping_address,
        shipping_method,
        shipments,
        status,
        total
    } = props.order;
    const classes = mergeClasses(defaultClasses, props.classes);

    const shippingMethodData = {
        shippingMethod: shipping_method,
        shipments
    };

    return (
        <div className={classes.root}>
            <div className={classes.shipping_information_container}>
                <ShippingInformation data={shipping_address} />
            </div>
            <div className={classes.shipping_method_container}>
                <ShippingMethod data={shippingMethodData} />
            </div>
        </div>
    );
};

export default OrderDetails;
