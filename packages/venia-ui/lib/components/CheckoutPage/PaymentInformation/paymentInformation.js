import React from 'react';
import { Form } from 'informed';
import { Edit2 as EditIcon } from 'react-feather';
import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';

import PaymentMethods from './paymentMethods';
import PriceAdjustments from '../PriceAdjustments';
import Button from '../../Button';
import Icon from '../../Icon';
import { mergeClasses } from '../../../classify';
import EditModal from './editModal';

import paymentInformationOperations from './paymentInformation.gql';

import defaultClasses from './paymentInformation.css';

const PaymentInformation = props => {
    const { onSave } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

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
        <div className={defaultClasses.summary}>
            <div className={defaultClasses.summary_heading_container}>
                <h5 className={defaultClasses.summary_heading}>
                    Payment Information
                </h5>
                <button
                    className={defaultClasses.edit_button}
                    onClick={showEditModal}
                >
                    <Icon size={16} src={EditIcon} attrs={{ fill: 'black' }} />
                </button>
            </div>
            <span>Credit Card</span>
            <span>{`${paymentNonce.details.cardType} ending in ${
                paymentNonce.details.lastFour
            }`}</span>
        </div>
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

export default PaymentInformation;
