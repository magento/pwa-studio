import { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useFieldApi, useFieldState } from 'informed';

export const useRegion = props => {
    const {
        countryCodeField = 'country',
        field = 'region',
        optionValueKey = 'code',
        queries: { getRegionsQuery }
    } = props;

    const hasInitialized = useRef(false);
    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;
    const regionFieldApi = useFieldApi(field);

    // Reset region value when country changes. Because of how Informed sets initialValues,
    // we want to skip the first state change of the value being initialized.
    useEffect(() => {
        if (country) {
            if (hasInitialized.current) {
                regionFieldApi.reset();
            } else {
                hasInitialized.current = true;
            }
        }
    }, [country, regionFieldApi]);

    const { data, error, loading } = useQuery(getRegionsQuery, {
        variables: { countryCode: country }
    });

    let formattedRegionsData = [{ label: 'Loading Regions...', value: '' }];
    if (!loading && !error) {
        const { country } = data;
        const { available_regions: availableRegions } = country;
        if (availableRegions) {
            formattedRegionsData = availableRegions.map(region => ({
                key: region.id,
                label: region.name,
                value: region[optionValueKey]
            }));
            formattedRegionsData.unshift({
                disabled: true,
                hidden: true,
                label: '',
                value: ''
            });
        } else {
            formattedRegionsData = [];
        }
    }

    return {
        loading,
        regions: formattedRegionsData
    };
};
