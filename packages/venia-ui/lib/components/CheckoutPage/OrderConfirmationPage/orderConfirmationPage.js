import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { object, shape, string } from 'prop-types';
import { useOrderConfirmationPage } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';

import { useStyle } from '../../../classify';
import { StoreTitle } from '../../../components/Head';
import CreateAccount from './createAccount';
import ItemsReview from '../ItemsReview';
import defaultClasses from './orderConfirmationPage.module.css';

const OrderConfirmationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { data, orderNumber } = props;
    const { formatMessage } = useIntl();

    const talonProps = useOrderConfirmationPage({
        data
    });

    const { flatData, isSignedIn } = talonProps;

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
        return (
            <span key={index} className={classes.addressStreet}>
                {row}
            </span>
        );
    });

    useEffect(() => {
        const { scrollTo } = globalThis;

        if (typeof scrollTo === 'function') {
            scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }
    }, []);

    const createAccountForm = !isSignedIn ? (
        <CreateAccount
            firstname={firstname}
            lastname={lastname}
            email={email}
        />
    ) : null;

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${region} ${postcode} ${country}`;

    return (
        <div className={classes.root} data-cy="OrderConfirmationPage-root">
            <StoreTitle>
                {formatMessage({
                    id: 'checkoutPage.titleReceipt',
                    defaultMessage: 'Receipt'
                })}
            </StoreTitle>
            <div className={classes.mainContainer}>
                <h2
                    data-cy="OrderConfirmationPage-header"
                    className={classes.heading}
                >
                    <FormattedMessage
                        id={'checkoutPage.thankYou'}
                        defaultMessage={'Thank you for your order!'}
                    />
                </h2>
                <div
                    data-cy="OrderConfirmationPage-orderNumber"
                    className={classes.orderNumber}
                >
                    <FormattedMessage
                        id={'checkoutPage.orderNumber'}
                        defaultMessage={'Order Number: {orderNumber}'}
                        values={{ orderNumber }}
                    />
                </div>
                <div
                    data-cy="OrderConfirmationPage-shippingInfoHeading"
                    className={classes.shippingInfoHeading}
                >
                    <FormattedMessage
                        id={'global.shippingInformation'}
                        defaultMessage={'Shipping Information'}
                    />
                </div>
                <div className={classes.shippingInfo}>
                    <span className={classes.email}>{email}</span>
                    <span className={classes.name}>{nameString}</span>
                    {streetRows}
                    <span className={classes.addressAdditional}>
                        {additionalAddressString}
                    </span>
                </div>
                <div
                    data-cy="OrderConfirmationPage-shippingMethodHeading"
                    className={classes.shippingMethodHeading}
                >
                    <FormattedMessage
                        id={'global.shippingMethod'}
                        defaultMessage={'Shipping Method'}
                    />
                </div>
                <div className={classes.shippingMethod}>{shippingMethod}</div>
                <div className={classes.itemsReview}>
                    <ItemsReview data={data} />
                </div>
                <div
                    data-cy="OrderConfirmationPage-additionalText"
                    className={classes.additionalText}
                >
                    <FormattedMessage
                        id={'checkoutPage.additionalText'}
                        defaultMessage={
                            'You will also receive an email with the details and we will let you know when your order has shipped.'
                        }
                    />
                </div>
            </div>
            <div className={classes.sidebarContainer}>{createAccountForm}</div>
        </div>
    );
};

export default OrderConfirmationPage;

OrderConfirmationPage.propTypes = {
    classes: shape({
        addressStreet: string,
        mainContainer: string,
        heading: string,
        orderNumber: string,
        shippingInfoHeading: string,
        shippingInfo: string,
        email: string,
        name: string,
        addressAdditional: string,
        shippingMethodHeading: string,
        shippingMethod: string,
        itemsReview: string,
        additionalText: string,
        sidebarContainer: string
    }),
    data: object.isRequired,
    orderNumber: string
};
