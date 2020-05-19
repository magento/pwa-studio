import React from 'react';
import { shape, func, string, bool } from 'prop-types';

import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';

import PaymentMethods from './paymentMethods';
import Summary from './summary';
import { mergeClasses } from '../../../classify';
import EditModal from './editModal';

import paymentInformationOperations from './paymentInformation.gql';

import defaultClasses from './paymentInformation.css';

const PaymentInformation = props => {
    const {
        onSave,
        classes: propClasses,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked,
        isMobile
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePaymentInformation({
        ...paymentInformationOperations,
        resetReviewOrderButtonClicked,
        onSave
    });

    const {
        doneEditing,
        currentSelectedPaymentMethod,
        isEditModalHidden,
        showEditModal,
        hideEditModal,
        handlePaymentError,
        handlePaymentSuccess,
        total
    } = talonProps;

    const paymentInformation = doneEditing ? (
        <Summary
            onEdit={showEditModal}
            isMobile={isMobile}
            selectedPaymentMethod={currentSelectedPaymentMethod}
        />
    ) : (
        <PaymentMethods
            reviewOrderButtonClicked={reviewOrderButtonClicked}
            selectedPaymentMethod={currentSelectedPaymentMethod}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            resetReviewOrderButtonClicked={resetReviewOrderButtonClicked}
            total={total}
        />
    );

    const editModal = !isEditModalHidden ? (
        <EditModal onClose={hideEditModal} />
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.payment_info_container}>
                {paymentInformation}
            </div>
            {editModal}
        </div>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        review_order_button: string
    }),
    reviewOrderButtonClicked: bool,
    isMobile: bool,
    onSave: func.isRequired,
    resetReviewOrderButtonClicked: func.isRequired
};
