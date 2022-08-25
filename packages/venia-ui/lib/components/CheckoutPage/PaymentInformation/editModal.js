import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func } from 'prop-types';

import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';
import Dialog from '../../Dialog';
import editablePayments from './editablePaymentCollection';

const EditModal = props => {
    const { onClose, isOpen } = props;
    const { formatMessage } = useIntl();

    const talonProps = useEditModal({ onClose });

    const {
        selectedPaymentMethod,
        handleUpdate,
        handleClose,
        handlePaymentSuccess,
        handlePaymentReady,
        updateButtonClicked,
        resetUpdateButtonClicked,
        handlePaymentError
    } = talonProps;

    const paymentMethodComponent = useMemo(() => {
        const isEditable = Object.keys(editablePayments).includes(
            selectedPaymentMethod
        );
        if (isEditable) {
            const PaymentMethodComponent =
                editablePayments[selectedPaymentMethod];
            return (
                <PaymentMethodComponent
                    onPaymentReady={handlePaymentReady}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    resetShouldSubmit={resetUpdateButtonClicked}
                    shouldSubmit={updateButtonClicked}
                />
            );
        } else {
            return (
                <div>
                    <FormattedMessage
                        id={'checkoutPage.paymentMethodStatus'}
                        defaultMessage={
                            '{selectedPaymentMethod} is not supported for editing.'
                        }
                        values={{ selectedPaymentMethod }}
                    />
                </div>
            );
        }
    }, [
        handlePaymentError,
        handlePaymentReady,
        handlePaymentSuccess,
        resetUpdateButtonClicked,
        selectedPaymentMethod,
        updateButtonClicked
    ]);

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
            {paymentMethodComponent}
        </Dialog>
    );
};

export default EditModal;

EditModal.propTypes = {
    onClose: func.isRequired,
    isOpen: bool
};
