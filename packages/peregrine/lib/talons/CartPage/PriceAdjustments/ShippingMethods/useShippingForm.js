import { useCallback } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

/**
 * GraphQL currently requires a complete address before it will return
 * estimated shipping prices, even though it only needs Country, State,
 * and Zip. Assuming this is a bug or oversight, we're going to mock the
 * data points we don't want to bother collecting from the Customer at this
 * step in the process. We need to be very mindful that these values are never
 * displayed to the user.
 */
const MOCKED_ADDRESS = {
    city: 'city',
    firstname: 'firstname',
    lastname: 'lastname',
    street: ['street'],
    telephone: 'telephone'
};

export const useShippingForm = props => {
    const {
        getCountriesQuery,
        getStatesQuery,
        selectedValues,
        setShippingMutation,
        shippingMethodsQuery
    } = props;

    const [{ cartId }] = useCartContext();
    const apolloClient = useApolloClient();

    const {
        data: countriesData,
        error: countriesError,
        loading: isCountriesLoading
    } = useQuery(getCountriesQuery);

    const {
        data: statesData,
        error: statesError,
        loading: isStatesLoading,
        refetch: fetchStates
    } = useQuery(getStatesQuery, {
        variables: { countryCode: selectedValues.country }
    });

    const [setShippingAddress, { loading: setShippingLoading }] = useMutation(
        setShippingMutation
    );

    const handleCountryChange = useCallback(
        country => {
            if (country) {
                fetchStates({
                    countryCode: country
                });
            }
        },
        [fetchStates]
    );

    const handleZipChange = useCallback(
        zip => {
            if (zip !== selectedValues.zip) {
                const data = apolloClient.readQuery({
                    query: shippingMethodsQuery,
                    variables: {
                        cartId
                    }
                });

                const { cart } = data;
                const { shipping_addresses: shippingAddresses } = cart;
                if (shippingAddresses.length) {
                    const primaryAddress = shippingAddresses[0];
                    const {
                        available_shipping_methods: availableMethods
                    } = primaryAddress;
                    if (availableMethods.length) {
                        apolloClient.writeQuery({
                            query: shippingMethodsQuery,
                            data: {
                                cart: {
                                    ...cart,
                                    shipping_addresses: [
                                        {
                                            ...primaryAddress,
                                            available_shipping_methods: []
                                        }
                                    ]
                                }
                            }
                        });
                    }
                }
            }
        },
        [apolloClient, cartId, selectedValues.zip, shippingMethodsQuery]
    );

    const handleOnSubmit = useCallback(
        formValues => {
            const { country, state, zip } = formValues;
            if (country && state && zip) {
                setShippingAddress({
                    variables: {
                        cartId,
                        address: {
                            ...MOCKED_ADDRESS,
                            country_code: country,
                            postcode: zip,
                            region: state
                        }
                    }
                });
            }
        },
        [cartId, setShippingAddress]
    );

    let formattedCountriesData = [{ label: 'Loading Countries...', value: '' }];
    if (!isCountriesLoading && !countriesError) {
        const { countries } = countriesData;
        formattedCountriesData = countries.map(country => ({
            label: country.full_name_english,
            value: country.two_letter_abbreviation
        }));
        formattedCountriesData.sort((a, b) => (a.label < b.label ? -1 : 1));
    }

    let formattedStatesData = [];
    if (!isStatesLoading && !statesError) {
        const { country } = statesData;
        const { available_regions: availableRegions } = country;
        if (availableRegions) {
            formattedStatesData = availableRegions.map(region => ({
                key: region.id,
                label: region.name,
                value: region.code
            }));
            formattedStatesData.unshift({
                disabled: true,
                hidden: true,
                label: '',
                value: ''
            });
        }
    }

    return {
        countries: formattedCountriesData,
        handleCountryChange,
        handleOnSubmit,
        handleZipChange,
        isCountriesLoading,
        setShippingLoading,
        states: formattedStatesData
    };
};
