import React from 'react';
import { shape, func, string } from 'prop-types';
import { Form } from 'informed';
import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';

import PaymentMethods from './paymentMethods';
import PriceAdjustments from '../PriceAdjustments';
import Button from '../../Button';
import Summary from './summary';
import { mergeClasses } from '../../../classify';
import EditModal from './editModal';

import paymentInformationOperations from './paymentInformation.gql';

import defaultClasses from './paymentInformation.css';

const PaymentInformation = props => {
    const { onSave, classes: propClasses } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePaymentInformation({
        operations: paymentInformationOperations,
        onSave
    });

    const {
        doneEditing,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        paymentNonce,
        selectedPaymentMethod,
        isEditModalHidden,
        showEditModal,
        hideEditModal
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
            disabled={
                /**
                 * Paypal is not available as of now. Should not allow
                 * user to proceed if that is the `selectedPaymentMethod`.
                 */
                !selectedPaymentMethod || selectedPaymentMethod === 'paypal'
            }
        >
            {'Review Order'}
        </Button>
    ) : null;

    const paymentInformation = doneEditing ? (
        <Summary onEdit={showEditModal} paymentNonce={paymentNonce} />
    ) : (
        <PaymentMethods
            shouldRequestPaymentNonce={shouldRequestPaymentNonce}
            selectedPaymentMethod={selectedPaymentMethod}
        />
    );

    const editModal = !isEditModalHidden ? (
        <EditModal
            onClose={hideEditModal}
            selectedPaymentMethod={selectedPaymentMethod}
        />
    ) : null;

    return (
        <Form>
            <div className={classes.container}>
                <div className={classes.payment_info_container}>
                    {paymentInformation}
                </div>
                {priceAdjustments}
                {reviewOrderButton}
                {editModal}
            </div>
        </Form>
    );
};

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        price_adjustments_container: string,
        review_order_button: string
    }),
    onSave: func.isRequired
};

export default PaymentInformation;
