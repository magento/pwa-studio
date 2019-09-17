import React, { useCallback } from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import AddressForm from './addressForm';
import PaymentsForm from './paymentsForm';
import ShippingForm from './shippingForm';

/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */
const EditableForm = props => {
    const {
        editing,
        isSubmitting,
        setEditing,
        shippingAddressError,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod,
        directory: { countries }
    } = props;

    const handleCancel = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitAddressForm = useCallback(
        async formValues => {
            await submitShippingAddress({
                formValues
            });
            setEditing(null);
        },
        [setEditing, submitShippingAddress]
    );

    const handleSubmitPaymentsForm = useCallback(
        async formValues => {
            await submitPaymentMethodAndBillingAddress({
                formValues
            });
            setEditing(null);
        },
        [setEditing, submitPaymentMethodAndBillingAddress]
    );

    const handleSubmitShippingForm = useCallback(
        async formValues => {
            await submitShippingMethod({
                formValues
            });
            setEditing(null);
        },
        [setEditing, submitShippingMethod]
    );

    switch (editing) {
        case 'address': {
            const { shippingAddress } = props;

            return (
                <AddressForm
                    cancel={handleCancel}
                    countries={countries}
                    error={shippingAddressError}
                    initialValues={shippingAddress}
                    isSubmitting={isSubmitting}
                    submit={handleSubmitAddressForm}
                />
            );
        }
        case 'paymentMethod': {
            const { billingAddress } = props;

            return (
                <PaymentsForm
                    cancel={handleCancel}
                    countries={countries}
                    initialValues={billingAddress}
                    isSubmitting={isSubmitting}
                    submit={handleSubmitPaymentsForm}
                />
            );
        }
        case 'shippingMethod': {
            const { availableShippingMethods, shippingMethod } = props;
            return (
                <ShippingForm
                    availableShippingMethods={availableShippingMethods}
                    cancel={handleCancel}
                    isSubmitting={isSubmitting}
                    shippingMethod={shippingMethod}
                    submit={handleSubmitShippingForm}
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
    directory: shape({
        countries: array
    }).isRequired
};

export default EditableForm;
