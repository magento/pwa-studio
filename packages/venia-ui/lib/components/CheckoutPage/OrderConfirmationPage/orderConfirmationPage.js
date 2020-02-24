import React from 'react';

import OrderSummary from './orderSummary';
import CreateAccount from './createAccount';
import ItemsReview from '../ItemsReview';
import Subscribe from './subscribe';

import classes from './orderConfirmationPage.css';

const OrderConfirmationPage = () => {
    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h2 className={classes.heading}>
                    {'Thank you for your order!'}
                </h2>
            </div>
            <OrderSummary />
            <CreateAccount />
            <div className={classes.items_review_container}>
                <ItemsReview />
            </div>
            <Subscribe />
            <div className={classes.email_review_container}>
                <div className={classes.email_review_text}>
                    You will also receive an email with the details and we will
                    let you know when your order has shipped.
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
