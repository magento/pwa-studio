import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

export const useForm = props => {
    const { countriesQuery } = props;

    const [countries, setCountries] = useState(null);

    const { data: countriesData } = useQuery(countriesQuery);

    useEffect(() => {
        if (countriesData) {
            setCountries(countriesData.countries);
        }
    }, [countriesData]);

    return {
        countries
    };
};
