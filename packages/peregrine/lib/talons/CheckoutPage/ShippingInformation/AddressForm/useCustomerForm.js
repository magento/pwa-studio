import { useCallback, useMemo, useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';

export const useCustomerForm = props => {
    const {
        afterSubmit,
        mutations: {
            createCustomerAddressMutation,
            updateCustomerAddressMutation
        },
        onCancel,
        queries: {
            getCustomerQuery,
            getCustomerAddressesQuery,
            getDefaultShippingQuery
        },
        shippingData
    } = props;

    const apolloClient = useApolloClient();
    const [cacheError, setCacheError] = useState(null);

    const [
        createCustomerAddress,
        {
            error: createCustomerAddressError,
            loading: createCustomerAddressLoading
        }
    ] = useMutation(createCustomerAddressMutation);

    const [
        updateCustomerAddress,
        {
            error: updateCustomerAddressError,
            loading: updateCustomerAddressLoading
        }
    ] = useMutation(updateCustomerAddressMutation);

    const { data: customerData, loading: getCustomerLoading } = useQuery(
        getCustomerQuery
    );

    const isSaving =
        createCustomerAddressLoading || updateCustomerAddressLoading;

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const { country, region } = shippingData;
    const { code: countryCode } = country;
    const { id: regionId, code: regionCode } = region;

    let initialRegionValue;
    try {
        // If the regions query returns available regions, use `region_id`. If
        // there are no selectable regions, the data is the region label.
        // TODO: Or could it be code? When free form text entered, region has:
        // { code: "Scotland", label: "Scotland", id: 0}
        if (countryHasRegions(apolloClient, countryCode)) {
            initialRegionValue = regionId && regionId.toString();
        } else {
            initialRegionValue = regionCode;
        }
    } catch (err) {
        setCacheError(err);
    }

    let initialValues = {
        ...shippingData,
        country: countryCode,
        region: initialRegionValue
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

    const handleSubmit = useCallback(
        async formValues => {
            // eslint-disable-next-line no-unused-vars
            const { country, email, region, ...address } = formValues;
            const regionValue = {};
            try {
                // If the regions query returns available regions, pass
                // it with `region_id`. If there are no selectable
                // regions, the field is "free form". Pass the text as
                // "region".
                if (countryHasRegions(apolloClient, country)) {
                    regionValue.region_id = region;
                } else {
                    regionValue.region = region;
                }
            } catch (err) {
                setCacheError(err);
            }

            try {
                const customerAddress = {
                    ...address,
                    country_code: country,
                    region: regionValue
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
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [
            afterSubmit,
            apolloClient,
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

    const errors = useMemo(
        () =>
            new Map([
                ['cacheError', cacheError],
                ['createCustomerAddressMutation', createCustomerAddressError],
                ['updateCustomerAddressMutation', updateCustomerAddressError]
            ]),
        [cacheError, createCustomerAddressError, updateCustomerAddressError]
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

function countryHasRegions(apolloClient, countryCode) {
    try {
        const data = apolloClient.readQuery({
            query: gql`
                query GetRegions($countryCode: String!) {
                    country(id: $countryCode) {
                        id
                        available_regions {
                            id
                            code
                            name
                        }
                    }
                }
            `,
            variables: {
                countryCode
            }
        });

        return !!data.country.available_regions;
    } catch (err) {
        // An error here indicates the cache was not primed. The
        // getRegions query needs to be made.
        throw new Error(
            'Unable to determine region value. Refresh the page and try again.'
        );
    }
}
