import React, { Fragment } from 'react';

import { useCreditCardSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCardSummary';

import { mergeClasses } from '../../../../classify';

import creditCardSummaryOperations from './creditCardSummary.gql';

import defaultClasses from './creditCardSummary.css';

const CreditCardSummary = props => {
    const { classes: propClasses } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useCreditCardSummary({ ...creditCardSummaryOperations });

    const { billingAddress, isBillingAddressSame, paymentNonce } = talonProps;

    const paymentSummary =
        paymentNonce && paymentNonce.details
            ? `${paymentNonce.details.cardType} ending in ${
                  paymentNonce.details.lastFour
              }`
            : '';

    const billingAddressSummary =
        !isBillingAddressSame && billingAddress ? (
            <div className={classes.address_summary_container}>
                <div>
                    <span className={classes.first_name}>
                        {billingAddress.firstName}
                    </span>
                    <span className={classes.last_name}>
                        {billingAddress.lastName}
                    </span>
                </div>
                <div>
                    <span className={classes.street1}>
                        {billingAddress.street1}
                    </span>
                    <span className={classes.street2}>
                        {billingAddress.street2}
                    </span>
                    <span className={classes.city}>{billingAddress.city}</span>
                    <span className={classes.state}>
                        {billingAddress.state}
                    </span>
                </div>
                <div>
                    <span className={classes.postalCode}>
                        {billingAddress.postalCode}
                    </span>
                    <span className={classes.country}>
                        {billingAddress.country}
                    </span>
                </div>
            </div>
        ) : null;

    return (
        <Fragment>
            <div className={classes.card_details_container}>
                <span className={classes.payment_type}>Credit Card</span>
                <span className={classes.payment_details}>
                    {paymentSummary}
                </span>
            </div>
            {billingAddressSummary}
        </Fragment>
    );
};

export default CreditCardSummary;
