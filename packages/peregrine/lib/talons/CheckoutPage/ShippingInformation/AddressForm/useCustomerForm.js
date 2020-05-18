import { useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

export const useCustomerForm = props => {
    const {
        afterSubmit,
        mutations: {
            createCustomerAddressMutation,
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

    const [
        createCustomerAddress,
        { loading: createCustomerAddressLoading }
    ] = useMutation(createCustomerAddressMutation);

    const [
        updateCustomerAddress,
        { loading: updateCustomerAddressLoading }
    ] = useMutation(updateCustomerAddressMutaton);

    const {
        error: getCustomerError,
        data: customerData,
        loading: getCustomerLoading
    } = useQuery(getCustomerQuery);

    useEffect(() => {
        if (getCustomerError) {
            console.error(getCustomerError);
        }
    }, [getCustomerError]);

    const isSaving =
        createCustomerAddressLoading || updateCustomerAddressLoading;

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const { country, region } = shippingData;
    const { code: countryCode } = country;
    const { id: regionId } = region;

    let initialValues = {
        ...shippingData,
        country: countryCode,
        region: regionId
    };

    const hasDefaultShipping =
        customerData && customerData.customer.default_shipping;

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

    const handleSubmit = useCallback(
        async formValues => {
            // eslint-disable-next-line no-unused-vars
            const { country, email, region, ...address } = formValues;
            try {
                const customerAddress = {
                    ...address,
                    country_code: country,
                    // Hard-coding region data until MC-33854/MC-33948 is resolved
                    region: {
                        region_id: region
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
