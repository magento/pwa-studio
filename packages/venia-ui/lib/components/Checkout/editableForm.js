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
            return (
                <AddressForm
                    cancel={handleCancel}
                    submit={handleSubmitAddressForm}
                    submitting={submitting}
                />
            );
        }
        case 'paymentMethod': {
            return (
                <PaymentsForm
                    cancel={handleCancel}
                    submit={handleSubmitPaymentsForm}
                    submitting={submitting}
                />
            );
        }
        case 'shippingMethod': {
            return (
                <ShippingForm
                    cancel={handleCancel}
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
