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
        editOrder,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod,
        submitting,
        isAddressInvalid,
        invalidAddressMessage,
        directory: { countries }
    } = props;

    const handleCancel = useCallback(() => {
        editOrder(null);
    }, [editOrder]);

    const handleSubmitAddressForm = useCallback(
        formValues => {
            submitShippingAddress({
                formValues
            });
        },
        [submitShippingAddress]
    );

    const handleSubmitPaymentsForm = useCallback(
        formValues => {
            submitPaymentMethodAndBillingAddress({
                formValues
            });
        },
        [submitPaymentMethodAndBillingAddress]
    );

    const handleSubmitShippingForm = useCallback(
        formValues => {
            submitShippingMethod({
                formValues
            });
        },
        [submitShippingMethod]
    );

    switch (editing) {
        case 'address': {
            const { shippingAddress } = props;

            return (
                <AddressForm
                    cancel={handleCancel}
                    countries={countries}
                    isAddressInvalid={isAddressInvalid}
                    invalidAddressMessage={invalidAddressMessage}
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
                    countries={countries}
                    initialValues={billingAddress}
                    submit={handleSubmitPaymentsForm}
                    submitting={submitting}
                />
            );
        }
        case 'shippingMethod': {
            const { availableShippingMethods, shippingMethod } = props;
            return (
                <ShippingForm
                    availableShippingMethods={availableShippingMethods}
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
    editOrder: func.isRequired,
    shippingAddress: object,
    shippingMethod: string,
    submitShippingAddress: func.isRequired,
    submitShippingMethod: func.isRequired,
    submitPaymentMethodAndBillingAddress: func.isRequired,
    submitting: bool,
    isAddressInvalid: bool,
    invalidAddressMessage: string,
    directory: shape({
        countries: array
    })
};

export default EditableForm;
