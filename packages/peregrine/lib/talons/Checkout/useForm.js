import { useQuery } from '@apollo/react-hooks';

export const useForm = props => {
    const { countriesQuery } = props;

    const { data } = useQuery(countriesQuery);

    const { countries } = data || {};

    return {
        countries
    };
};
