import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from './customerForm.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useEventingContext } from '../../../../context/eventing';

export const useCustomerForm = props => {
    const { afterSubmit, onCancel, onSuccess, shippingData } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCustomerAddressMutation,
        updateCustomerAddressMutation,
        getCustomerQuery,
        getCustomerAddressesQuery,
        getDefaultShippingQuery
    } = operations;

    const [
        createCustomerAddress,
        {
            error: createCustomerAddressError,
            loading: createCustomerAddressLoading
        }
    ] = useMutation(createCustomerAddressMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const [
        updateCustomerAddress,
        {
            error: updateCustomerAddressError,
            loading: updateCustomerAddressLoading
        }
    ] = useMutation(updateCustomerAddressMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const { data: customerData, loading: getCustomerLoading } = useQuery(
        getCustomerQuery
    );

    const isSaving =
        createCustomerAddressLoading || updateCustomerAddressLoading;

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const { country } = shippingData;
    const { code: countryCode } = country;

    let initialValues = {
        ...shippingData,
        country: countryCode
    };

    const hasDefaultShipping =
        !!customerData && !!customerData.customer.default_shipping;

    // For first time creation pre-fill the form with Customer data
    if (!isUpdate && !getCustomerLoading && !hasDefaultShipping) {
        const { customer } = customerData;
        const { email, firstname, lastname } = customer;
        const defaultUserData = { email, firstname, lastname };
        initialValues = {
            ...initialValues,
            ...defaultUserData
        };
    }

    const [, { dispatch }] = useEventingContext();
    const dispatchEvent = useCallback(
        (action, address) => {
            if (action === 'ADD') {
                dispatch({
                    type: 'USER_ADDRESS_CREATE',
                    payload: {
                        address: address,
                        user: customerData
                    }
                });
            }
            if (action === 'EDIT') {
                dispatch({
                    type: 'USER_ADDRESS_EDIT',
                    payload: {
                        address: address,
                        user: customerData
                    }
                });
            }
            if (!hasDefaultShipping) {
                dispatch({
                    type: 'CHECKOUT_SHIPPING_INFORMATION_ADDED',
                    payload: {
                        cart_id: customerData.cart_id
                    }
                });
            }
        },
        [customerData, dispatch, hasDefaultShipping]
    );

    const handleSubmit = useCallback(
        async formValues => {
            // eslint-disable-next-line no-unused-vars
            const { country, email, ...address } = formValues;
            try {
                const customerAddress = {
                    ...address,
                    // Cleans up the street array when values are null or undefined
                    street: address.street.filter(e => e),
                    country_code: country
                };

                if (isUpdate) {
                    const { id: addressId } = shippingData;
                    await updateCustomerAddress({
                        variables: {
                            addressId,
                            address: customerAddress
                        },
                        refetchQueries: [{ query: getCustomerAddressesQuery }]
                    });
                    dispatchEvent('EDIT', customerAddress);
                } else {
                    await createCustomerAddress({
                        variables: {
                            address: customerAddress
                        },
                        refetchQueries: [
                            { query: getCustomerAddressesQuery },
                            { query: getDefaultShippingQuery }
                        ]
                    });
                    dispatchEvent('ADD', customerAddress);
                }
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [
            afterSubmit,
            createCustomerAddress,
            getCustomerAddressesQuery,
            getDefaultShippingQuery,
            isUpdate,
            shippingData,
            updateCustomerAddress,
            dispatchEvent
        ]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const errors = useMemo(
        () =>
            new Map([
                ['createCustomerAddressMutation', createCustomerAddressError],
                ['updateCustomerAddressMutation', updateCustomerAddressError]
            ]),
        [createCustomerAddressError, updateCustomerAddressError]
    );

    return {
        errors,
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading: getCustomerLoading,
        isSaving,
        isUpdate
    };
};
