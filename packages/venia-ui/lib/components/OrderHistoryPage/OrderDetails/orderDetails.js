import React from 'react';

import ShippingInformation from './shippingInformation';

const OrderDetails = props => {
    const {
        billing_address,
        items,
        order_date,
        order_total,
        payment_methods,
        shipping_address,
        shipping_method,
        status,
        total
    } = props.order;

    return (
        <div>
            <ShippingInformation data={shipping_address} />
        </div>
    );
};

export default OrderDetails;
