import React from 'react';

import classes from './orderPlacedPage.css';

const OrderSummary = () => {
    return (
        <div className={classes.order_summary_container}>
            <div className={classes.order_summary_heading}>
                Order Number: **************
            </div>
            <div className={classes.order_summary_heading}>
                Shipping Information
            </div>
            <div className={classes.text}>Goosey Goose</div>
            <div className={classes.text}>12345 Lake Ln, Austin, TX, 78759</div>
            <div className={classes.order_summary_heading}>Shipping Method</div>
            <div className={classes.text}>
                Standard - Delivery in 3-5 business days
            </div>
        </div>
    );
};

export default OrderSummary;
