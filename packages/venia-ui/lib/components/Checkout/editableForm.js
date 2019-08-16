import React, { useCallback } from 'react';
import { array, bool, func, object, oneOf, string } from 'prop-types';

import AddressForm from './addressForm';
import PaymentsForm from './paymentsForm';
import ShippingForm from './shippingForm';

/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */
const EditableForm = props => {
    const { editing, setEditing, submitting } = props;

    const handleCancel = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitAddressForm = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitPaymentsForm = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitShippingForm = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    switch (editing) {
        case 'address': {
            const { shippingAddress } = props;

            return (
                <AddressForm
                    cancel={handleCancel}
                    initialValues={shippingAddress}
                    submit={handleSubmitAddressForm}
                    submitting={submitting}
                />
            );
        }
        case 'paymentMethod': {
            const { billingAddress } = props;

            return (
                <PaymentsForm
                    cancel={handleCancel}
                    initialValues={billingAddress}
                    submit={handleSubmitPaymentsForm}
                    submitting={submitting}
                />
            );
        }
        case 'shippingMethod': {
            const { shippingMethod } = props;
            return (
                <ShippingForm
                    cancel={handleCancel}
                    shippingMethod={shippingMethod}
                    submit={handleSubmitShippingForm}
                    submitting={submitting}
                />
            );
        }
        default: {
            return null;
        }
    }
};

EditableForm.propTypes = {
    availableShippingMethods: array,
    editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
    setEditing: func.isRequired,
    shippingAddress: object,
    shippingMethod: string,
    submitting: bool
};

export default EditableForm;
