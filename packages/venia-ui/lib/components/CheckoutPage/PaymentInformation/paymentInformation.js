import React from 'react';
import { shape, func, string, bool } from 'prop-types';

import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';

import PaymentMethods from './paymentMethods';
import Summary from './summary';
import { mergeClasses } from '../../../classify';
import EditModal from './editModal';

import paymentInformationOperations from './paymentInformation.gql';

import defaultClasses from './paymentInformation.css';
import LoadingIndicator from '../../LoadingIndicator';

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
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked,
        onSave
    });

    const {
        doneEditing,
        currentSelectedPaymentMethod,
        isEditModalActive,
        isLoading,
        showEditModal,
        hideEditModal,
        handlePaymentError,
        handlePaymentSuccess
    } = talonProps;

    if (isLoading) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                Fetching Payment Information
            </LoadingIndicator>
        );
    }

    const paymentInformation = doneEditing ? (
        <Summary onEdit={showEditModal} isMobile={isMobile} />
    ) : (
        <PaymentMethods
            reviewOrderButtonClicked={reviewOrderButtonClicked}
            selectedPaymentMethod={currentSelectedPaymentMethod}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            resetReviewOrderButtonClicked={resetReviewOrderButtonClicked}
        />
    );

    const editModal = isEditModalActive ? (
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
