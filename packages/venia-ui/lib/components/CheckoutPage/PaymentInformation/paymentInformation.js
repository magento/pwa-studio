import React from 'react';
import { Form } from 'informed';
import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/usePaymentInformation';

import PaymentMethods from './paymentMethods';
import PriceAdjustments from '../PriceAdjustments';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';
import paymentInformationOperations from './paymentInformation.gql';

import defaultClasses from './paymentInformation.css';

const PaymentInformation = props => {
    const { onSave } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    // TODO: Replace "doneEditing" with a query for existing data.
    const talonProps = usePaymentInformation({
        operations: paymentInformationOperations,
        onSave
    });
    const {
        doneEditing,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        onPaymentSuccess,
        paymentNonce,
        setSelectedPaymentMethod,
        selectedPaymentMethod
    } = talonProps;

    const priceAdjustments = !doneEditing ? (
        <div className={classes.price_adjustments_container}>
            <PriceAdjustments />
        </div>
    ) : null;

    const reviewOrderButton = !doneEditing ? (
        <Button
            onClick={handleReviewOrder}
            priority="high"
            className={classes.review_order_button}
            disabled={!selectedPaymentMethod}
        >
            {'Review Order'}
        </Button>
    ) : null;

    const paymentInformation = doneEditing ? (
        <div className={defaultClasses.summary}>
            <span className={defaultClasses.summary_heading}>
                Payment Information
            </span>
            <span>Credit Card</span>
            <span>{`${paymentNonce.details.cardType} ending in ${
                paymentNonce.details.lastFour
            }`}</span>
        </div>
    ) : (
        <PaymentMethods
            shouldRequestPaymentNonce={shouldRequestPaymentNonce}
            onPaymentSuccess={onPaymentSuccess}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            selectedPaymentMethod={selectedPaymentMethod}
        />
    );

    return (
        <Form>
            <div className={classes.container}>
                <div className={classes.payment_info_container}>
                    {paymentInformation}
                </div>
                {priceAdjustments}
                {reviewOrderButton}
            </div>
        </Form>
    );
};

export default PaymentInformation;
