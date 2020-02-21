import React from 'react';

import classes from './orderPlacedPage.css';

const OrderPlacedPage = () => {
    return (
        <div>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>
                    {'Thank you for your order!'}
                </h1>
            </div>
        </div>
    );
};

export default OrderPlacedPage;
