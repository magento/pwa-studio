import React, { Fragment, useEffect } from 'react';

import CreateAccount from './createAccount';
import ItemsReview from '../ItemsReview';
import { mergeClasses } from '../../../classify';

import defaultClasses from './orderConfirmationPage.css';
import { useOrderConfirmationPage } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';

const OrderConfirmationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { data, orderNumber } = props;

    const talonProps = useOrderConfirmationPage({
        data
    });

    const { flatData } = talonProps;

    const {
        city,
        country,
        email,
        firstname,
        lastname,
        postcode,
        region,
        shippingMethod,
        street
    } = flatData;

    const streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    useEffect(() => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <Fragment>
            <h2 className={classes.heading}>{'Thank you for your order!'}</h2>
            <div
                className={classes.orderNumber}
            >{`Order Number: ${orderNumber}`}</div>
            <div className={classes.shippingInfoHeading}>
                Shipping Information
            </div>
            <div className={classes.shippingInfoDetails}>
                <div>{email}</div>
                <div>{`${firstname} ${lastname}`}</div>
                <div className={classes.shippingAddress}>
                    {streetRows}
                    <span
                        className={classes.area}
                    >{`${city}, ${region} ${postcode} ${country}`}</span>
                </div>
            </div>
            <div className={classes.shippingMethodHeading}>Shipping Method</div>
            <div className={classes.shippingMethod}>{shippingMethod}</div>
            <div className={classes.itemsReview}>
                <ItemsReview data={data} />
            </div>
            <div className={classes.additionalText}>
                You will also receive an email with the details and we will let
                you know when your order has shipped.
            </div>
            <div className={classes.sidebarContainer}>
                <CreateAccount
                    firstname={firstname}
                    lastname={lastname}
                    email={email}
                />
            </div>
        </Fragment>
    );
};

export default OrderConfirmationPage;
