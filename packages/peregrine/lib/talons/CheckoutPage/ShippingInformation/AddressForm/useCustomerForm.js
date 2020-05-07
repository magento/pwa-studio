import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useCustomerForm = props => {
    const {
        addressType,
        afterSubmit,
        mutations: {
            createCustomerAddressMutation,
            setDefaultAddressMutation,
            updateCustomerAddressMutaton
        },
        onCancel,
        queries: {
            getCustomerQuery,
            getCustomerAddressesQuery,
            getDefaultShippingQuery
        },
        shippingData
    } = props;

    const [{ cartId }] = useCartContext();

    const [
        createCustomerAddress,
        {
            called: createCustomerAddressCalled,
            loading: createCustomerAddressLoading
        }
    ] = useMutation(createCustomerAddressMutation);

    const [
        updateCustomerAddress,
        {
            called: updateCustomerAddressCalled,
            loading: updateCustomerAddressLoading
        }
    ] = useMutation(updateCustomerAddressMutaton);

    const [
        setDefaultAddress,
        { called: setDefaultAddressCalled, loading: setDefaultAddressLoading }
    ] = useMutation(setDefaultAddressMutation);

    const {
        error: getCustomerError,
        data: getCustomerData,
        loading: getCustomerLoading
    } = useQuery(getCustomerQuery);

    const isSaving =
        (createCustomerAddressCalled && createCustomerAddressLoading) ||
        (updateCustomerAddressCalled && updateCustomerAddressLoading) ||
        (setDefaultAddressCalled && setDefaultAddressLoading);

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const { country, region } = shippingData;
    const { code: countryCode } = country;
    const { code: regionCode } = region;

    let initialValues = {
        ...shippingData,
        country: countryCode,
        region: regionCode
    };

    const hasDefaultShipping =
        getCustomerData && getCustomerData.customer.default_shipping;

    // For first time creation pre-fill the form with Customer data
    if (!isUpdate && !getCustomerLoading && !hasDefaultShipping) {
        const { customer } = getCustomerData;
        const { email, firstname, lastname } = customer;
        const defaultUserData = { email, firstname, lastname };
        initialValues = {
            ...initialValues,
            ...defaultUserData
        };
    }

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, region, ...address } = formValues;
            try {
                const customerAddress = {
                    ...address,
                    country_code: country,
                    // Hard-coding region data until MC-33854/MC-33948 is resolved
                    region: {
                        region: 'Alabama',
                        region_id: 1,
                        region_code: region
                    }
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
                }
            } catch (error) {
                console.error(error);
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
            updateCustomerAddress
        ]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading: getCustomerLoading,
        isSaving,
        isUpdate
    };
};
