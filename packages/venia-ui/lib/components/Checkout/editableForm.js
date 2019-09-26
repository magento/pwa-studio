import React from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import AddressForm from './addressForm';
import PaymentsForm from './paymentsForm';
import ShippingForm from './shippingForm';
import { useEditableForm } from '@magento/peregrine/lib/talons/Checkout/useEditableForm';

/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */
const EditableForm = props => {
    const {
        checkout: { countries },
        editing,
        isSubmitting,
        setEditing,
        shippingAddressError,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod
    } = props;

    const {
        handleCancel,
        handleSubmitAddressForm,
        handleSubmitPaymentsForm,
        handleSubmitShippingForm
    } = useEditableForm({
        setEditing,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod
    });

    switch (editing) {
        case 'address': {
            const { shippingAddress } = props;

            return (
                <AddressForm
                    onCancel={handleCancel}
                    countries={countries}
                    error={shippingAddressError}
                    initialValues={shippingAddress}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitAddressForm}
                />
            );
        }
        case 'paymentMethod': {
            const { billingAddress } = props;

            return (
                <PaymentsForm
                    onCancel={handleCancel}
                    countries={countries}
                    initialValues={billingAddress}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitPaymentsForm}
                />
            );
        }
        case 'shippingMethod': {
            const { availableShippingMethods, shippingMethod } = props;
            return (
                <ShippingForm
                    availableShippingMethods={availableShippingMethods}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                    shippingMethod={shippingMethod}
                    onSubmit={handleSubmitShippingForm}
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
    isSubmitting: bool,
    setEditing: func.isRequired,
    shippingAddress: object,
    shippingAddressError: string,
    shippingMethod: string,
    submitShippingAddress: func.isRequired,
    submitShippingMethod: func.isRequired,
    submitPaymentMethodAndBillingAddress: func.isRequired,
    checkout: shape({
        countries: array
    }).isRequired
};

export default EditableForm;
