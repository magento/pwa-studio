import React from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import { useEditableForm } from '@magento/peregrine/lib/talons/Checkout/useEditableForm';

import AddressForm from './addressForm';
import PaymentsForm from './paymentsForm';
import ShippingForm from './shippingForm';

/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */
const EditableForm = props => {
    const {
        countries,
        editing,
        isSubmitting,
        setEditing,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    } = props;

    const {
        handleCancel,
        handleSubmitAddressForm,
        handleSubmitPaymentsForm,
        handleSubmitShippingForm
    } = useEditableForm({
        countries,
        setEditing,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    });

    switch (editing) {
        case 'address': {
            return (
                <AddressForm
                    onCancel={handleCancel}
                    countries={countries}
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
    shippingMethod: string,
    submitShippingMethod: func.isRequired,
    submitPaymentMethodAndBillingAddress: func.isRequired,
    checkout: shape({
        countries: array
    }).isRequired
};

export default EditableForm;
