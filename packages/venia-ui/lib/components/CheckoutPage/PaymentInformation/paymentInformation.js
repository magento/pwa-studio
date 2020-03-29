import React from 'react';
import { Form } from 'informed';
import usePaymentInformation from '@magento/peregrine/lib/talons/CheckoutPage/usePaymentInformation';

import PaymentMethods from './paymentMethods';
import PriceAdjustments from '../PriceAdjustments';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';

import defaultClasses from './paymentInformation.css';

const PaymentInformation = props => {
    const { onSave } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    // TODO: Replace "doneEditing" with a query for existing data.
    const talonProps = usePaymentInformation({ onSave });
    const { doneEditing, handleReviewOrder } = talonProps;

    /**
     * TODO
     *
     * Change this to reflect diff UI in diff mode.
     */
    const paymentInformation = doneEditing ? (
        <div>In Read Only Mode</div>
    ) : (
        <div>In Edit Mode</div>
    );

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
        >
            {'Review Order'}
        </Button>
    ) : null;

    return (
        <Form>
            <div className={classes.container}>
                <div className={classes.payment_info_container}>
                    <PaymentMethods doneEditing={doneEditing} />
                    <div className={classes.text_content}>
                        {paymentInformation}
                    </div>
                </div>
                {priceAdjustments}
                {reviewOrderButton}
            </div>
        </Form>
    );
};

export default PaymentInformation;
