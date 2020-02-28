import React from 'react';

import classes from './orderConfirmationPage.css';

const OrderSummary = () => {
    return (
        <div className={classes.order_summary_container}>
            <div className={classes.order_summary_heading}>
                Order Number: **************
            </div>
            <div className={classes.order_summary_heading}>
                Shipping Information
            </div>
            <div className={classes.ordered_by}>Goosey Goose</div>
            <div className={classes.address}>
                12345 Lake Ln, Austin, TX, 78759
            </div>
            <div className={classes.order_summary_heading}>Shipping Method</div>
            <div className={classes.shipping_information}>
                Standard - Delivery in 3-5 business days
            </div>
        </div>
    );
};

export default OrderSummary;
