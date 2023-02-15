import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from './country.gql';
import { mergeOperations } from '@magento/peregrine/lib/util/shallowMerge';

export const useCountry = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCountriesQuery } = operations;

    const { data, error, loading } = useQuery(getCountriesQuery);

    let formattedCountriesData = [{ label: 'Loading Countries...', value: '' }];
    if (!loading && !error) {
        const { countries } = data;
        formattedCountriesData = countries.map(country => ({
            // If a country is missing the full english name just show the abbreviation.
            label: country.full_name_english || country.two_letter_abbreviation,
            value: country.two_letter_abbreviation
        }));
        formattedCountriesData.sort((a, b) => (a.label < b.label ? -1 : 1));
    }

    return {
        countries: formattedCountriesData,
        loading
    };
};
