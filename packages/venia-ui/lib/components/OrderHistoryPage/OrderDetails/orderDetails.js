import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import BillingInformation from './billingInformation';
import Items from './items';
import PaymentMethod from './paymentMethod';
import ShippingInformation from './shippingInformation';
import ShippingMethod from './shippingMethod';

import defaultClasses from './orderDetails.css';
import OrderTotal from './orderTotal';

const OrderDetails = props => {
    const { classes: propClasses, imagesData, orderData } = props;
    const {
        billing_address,
        items,
        payment_methods,
        shipping_address,
        shipping_method,
        shipments,
        total
    } = orderData;
    const classes = mergeClasses(defaultClasses, propClasses);

    const shippingMethodData = {
        shippingMethod: shipping_method,
        shipments
    };

    return (
        <div className={classes.root}>
            <div className={classes.shippingInformationContainer}>
                <ShippingInformation data={shipping_address} />
            </div>
            <div className={classes.shippingMethodContainer}>
                <ShippingMethod data={shippingMethodData} />
            </div>
            <div className={classes.billingInformationContainer}>
                <BillingInformation data={billing_address} />
            </div>
            <div className={classes.paymentMethodContainer}>
                <PaymentMethod data={payment_methods} />
            </div>
            <div className={classes.itemsContainer}>
                <Items data={{ imagesData, items }} />
            </div>
            <div className={classes.orderTotalContainer}>
                <OrderTotal data={total} />
            </div>
            <div className={classes.printButton}>Print Button</div>
        </div>
    );
};

export default OrderDetails;
