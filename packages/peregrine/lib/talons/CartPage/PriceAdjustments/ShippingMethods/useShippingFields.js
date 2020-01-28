import { useCallback, useEffect } from 'react';
import { useFormApi, useFormState } from 'informed';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';

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

export const useShippingFields = props => {
    const { getCountriesQuery, getStatesQuery, setShippingMutation } = props;
    const formApi = useFormApi();
    const { values: formValues } = useFormState();
    const { country, state, zip } = formValues;
    const [{ cartId }] = useCartContext();

    const {
        data: countriesData,
        error: countriesError,
        loading: isCountriesLoading
    } = useQuery(getCountriesQuery);

    const [
        fetchStates,
        {
            called: fetchStatesCalled,
            data: statesData,
            error: statesError,
            loading: isStatesLoading
        }
    ] = useLazyQuery(getStatesQuery);

    const [setShippingAddress] = useMutation(setShippingMutation);

    useEffect(() => {
        if (country) {
            fetchStates({
                variables: {
                    countryCode: country
                }
            });
        }
    }, [country, fetchStates, formApi]);

    const handleZipOnBlur = useCallback(() => {
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
    }, [cartId, country, setShippingAddress, state, zip]);

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
    if (fetchStatesCalled && !isStatesLoading && !statesError) {
        const { country } = statesData;
        const { available_regions: availableRegions } = country;
        if (availableRegions) {
            formattedStatesData = availableRegions.map(region => ({
                id: region.id,
                label: region.name,
                value: region.code
            }));
            formattedStatesData.unshift({ label: '', value: '' });
        }
    }

    return {
        countries: formattedCountriesData,
        handleZipOnBlur,
        isCountriesLoading,
        states: formattedStatesData
    };
};
