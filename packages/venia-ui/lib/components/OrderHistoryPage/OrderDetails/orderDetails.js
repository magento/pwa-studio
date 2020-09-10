import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import BillingInformation from './billingInformation';
import Items from './items';
import PaymentMethod from './paymentMethod';
import ShippingInformation from './shippingInformation';
import ShippingMethod from './shippingMethod';

import defaultClasses from './orderDetails.css';

const OrderDetails = props => {
    const { classes: propClasses, imagesData, orderData } = props;
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
    } = orderData;
    const classes = mergeClasses(defaultClasses, propClasses);

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
            <div className={classes.billing_information_container}>
                <BillingInformation data={billing_address} />
            </div>
            <div className={classes.payment_method_container}>
                <PaymentMethod data={payment_methods} />
            </div>
            <div className={classes.items_container}>
                <Items data={{ imagesData, items }} />
            </div>
        </div>
    );
};

export default OrderDetails;
