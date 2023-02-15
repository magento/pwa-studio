import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from '../Country/country.gql';
import { mergeOperations } from '@magento/peregrine/lib/util/shallowMerge';

export const useForm = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCountriesQuery } = operations;

    const { loading: isLoadingCountries, error: countriesError, data: countriesData } = useQuery(getCountriesQuery);
    const { countries } = countriesData || {};

    return {
        countries,
        hasError: !!countriesError,
        isLoading: !!isLoadingCountries
    };
};
