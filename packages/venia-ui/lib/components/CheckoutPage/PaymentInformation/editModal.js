import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';

import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';

import { mergeClasses } from '../../../classify';
import CreditCard from './creditCard';
import Dialog from '../../Dialog';
import editModalOperations from './editModal.gql';

import defaultClasses from './editModal.css';

const EditModal = props => {
    const { classes: propClasses, onClose, isOpen } = props;
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useEditModal({ onClose, ...editModalOperations });

    const {
        selectedPaymentMethod,
        handleUpdate,
        handleClose,
        handlePaymentSuccess,
        handleDropinReady,
        updateButtonClicked,
        resetUpdateButtonClicked,
        handlePaymentError
    } = talonProps;

    const paymentMethod =
        selectedPaymentMethod === 'braintree' ? (
            <div className={classes.body}>
                <CreditCard
                    onDropinReady={handleDropinReady}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    resetShouldSubmit={resetUpdateButtonClicked}
                    shouldSubmit={updateButtonClicked}
                />
            </div>
        ) : (
            <div>
                <FormattedMessage
                    id={'checkoutPage.paymentMethodStatus'}
                    defaultMessage={
                        'The selected method is not supported for editing.'
                    }
                    values={{ selectedPaymentMethod }}
                />
            </div>
        );

    return (
        <Dialog
            confirmText={'Update'}
            confirmTranslationId={'global.updateButton'}
            isOpen={isOpen}
            onCancel={handleClose}
            onConfirm={handleUpdate}
            shouldDisableAllButtons={updateButtonClicked}
            shouldDisableConfirmButton={updateButtonClicked}
            title={formatMessage({
                id: 'checkoutPage.editPaymentInformation',
                defaultMessage: 'Edit Payment Information'
            })}
        >
            {paymentMethod}
        </Dialog>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        body: string,
        header: string,
        header_text: string,
        close_button: string
    }),
    onClose: func.isRequired
};
