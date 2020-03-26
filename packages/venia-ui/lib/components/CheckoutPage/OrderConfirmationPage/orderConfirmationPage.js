import React, { Fragment } from 'react';

import CreateAccount from './createAccount';
import ItemsReview from '../ItemsReview';
import Subscribe from './subscribe';
import { mergeClasses } from '../../../classify';

import defaultClasses from './orderConfirmationPage.css';

const flatten = data => {
    const { cart } = data;
    const { shipping_addresses } = cart;
    const address = shipping_addresses[0];

    const name = `${address.firstname} ${address.lastname}`;

    const shippingAddress = `${address.street[0]} ${address.city}, ${
        address.region.label
    } ${address.postcode} ${address.country.label}`;

    const shippingMethod = `${address.selected_shipping_method.method_title}`;

    return {
        email: cart.email,
        name,
        shippingAddress,
        shippingMethod,
        totalItemQuantity: cart.total_quantity
    };
};
const OrderConfirmationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { data, orderNumber } = props;

    const {
        email,
        name,
        shippingAddress,
        shippingMethod,
        totalItemQuantity
    } = flatten(data);

    return (
        <Fragment>
            <h2 className={classes.heading}>{'Thank you for your order!'}</h2>
            <div
                className={classes.orderNumber}
            >{`Order Number: ${orderNumber}`}</div>
            <div className={classes.shippingInfoHeading}>
                Shipping Information
            </div>
            <div className={classes.shippingAddress}>
                <div>{email}</div>
                <div>{name}</div>
                <div>{shippingAddress}</div>
            </div>
            <div className={classes.shippingMethodHeading}>Shipping Method</div>
            <div className={classes.shippingMethod}>{shippingMethod}</div>
            <div className={classes.itemsReview}>
                <ItemsReview />
            </div>
            <div className={classes.additionalText}>
                You will also receive an email with the details and we will let
                you know when your order has shipped.
            </div>
            <div className={classes.sidebarContainer}>
                {/*
                // TODO: Auth view.
                <div className={classes.referFriend}>
                    <ReferAFriend />
                </div>
            */}
                <div className={classes.createAccount}>
                    <CreateAccount />
                </div>
                <div className={classes.subscribe}>
                    <Subscribe />
                </div>
            </div>
        </Fragment>
    );
};

export default OrderConfirmationPage;
