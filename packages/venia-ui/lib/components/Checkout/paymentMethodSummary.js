import React, { Fragment } from 'react';
import { bool, shape, string } from 'prop-types';

const PaymentMethodSummary = props => {
    const { classes, hasPaymentMethod, paymentData } = props;

    if (!hasPaymentMethod) {
        const promptText = 'Add Billing Information';
        return <span className={classes.informationPrompt}>{promptText}</span>;
    }

    let primaryDisplay = '';
    let secondaryDisplay = '';
    if (paymentData) {
        primaryDisplay = paymentData.details.cardType;
        secondaryDisplay = paymentData.description;
    }

    return (
        <Fragment>
            <strong className={classes.paymentDisplayPrimary}>
                {primaryDisplay}
            </strong>
            <br />
            <span className={classes.paymentDisplaySecondary}>
                {secondaryDisplay}
            </span>
        </Fragment>
    );
};

PaymentMethodSummary.propTypes = {
    classes: shape({
        informationPrompt: string,
        paymentDisplayPrimary: string,
        paymentDisplaySecondary: string
    }),
    hasPaymentMethod: bool,
    paymentData: shape({
        description: string,
        details: shape({
            cardType: string
        })
    })
};

export default PaymentMethodSummary;
