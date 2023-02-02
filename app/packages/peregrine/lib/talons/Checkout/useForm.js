import { useQuery } from '@apollo/client';

export const useForm = props => {
    const { countriesQuery } = props;

    const {
        loading: isLoadingCountries,
        error: countriesError,
        data: countriesData
    } = useQuery(countriesQuery);
    const { countries } = countriesData || {};

    return {
        countries,
        hasError: !!countriesError,
        isLoading: !!isLoadingCountries
    };
};
