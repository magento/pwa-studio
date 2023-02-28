import { useCallback, useMemo } from 'react';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';
import { useMutation } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import DEFAULT_OPERATIONS from './addressForm.gql';
import SHIPPING_METHODS_OPERATIONS from '../CartPage/PriceAdjustments/ShippingMethods/shippingMethods.gql';

import mergeOperations from '../../util/shallowMerge';

/**
 * Returns values used to render an AddressForm component.
 *
 * @param {Object} props
 * @param {Object[]} props.fields an array of fields to reduce over for initial values
 * @param {function} props.onCancel cancel callback
 * @param {function} props.onSubmit submit callback
 * @returns {{
 *   handleCancel: function,
 *   handleSubmit: function,
 *   initialValues: object
 * }}
 */
export const useAddressForm = props => {
    const { countries, fields, onCancel, onSubmit } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, SHIPPING_METHODS_OPERATIONS, props.operations);
    const { setGuestEmailOnCartMutation, setShippingAddressMutation } = operations;

    const [{ shippingAddress, shippingAddressError }, { submitShippingAddress }] = useCheckoutContext();

    const [{ isSignedIn }] = useUserContext();

    const [setGuestEmail] = useMutation(setGuestEmailOnCartMutation, {
        // For security, never cache this mutation or the mutation results.
        fetchPolicy: 'no-cache'
    });

    const [setShippingAddressOnCart] = useMutation(setShippingAddressMutation);

    const values = useMemo(
        () =>
            fields.reduce((acc, key) => {
                acc[key] = shippingAddress[key];
                return acc;
            }, {}),
        [fields, shippingAddress]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSubmit = useCallback(
        async addressFormValues => {
            console.log('useAddressForm:' + { addressFormValues });
            try {
                await submitShippingAddress({
                    formValues: addressFormValues,
                    countries,
                    setGuestEmail,
                    setShippingAddressOnCart
                });
                onSubmit();
            } catch (error) {
                console.error(error);
            }
        },
        [countries, onSubmit, setGuestEmail, setShippingAddressOnCart, submitShippingAddress]
    );

    return {
        error: shippingAddressError,
        handleCancel,
        handleSubmit,
        isSignedIn,
        initialValues: values
    };
};
