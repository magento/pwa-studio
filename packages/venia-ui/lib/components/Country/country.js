import React from 'react';
import { useCountry } from '@magento/peregrine/lib/talons/Country/useCountry';

import { mergeClasses } from '../../classify';
import Field from '../Field';
import Select from '../Select';
import defaultClasses from './country.css';
import { GET_COUNTRIES_QUERY } from './country.gql';

const Country = props => {
    const talonProps = useCountry({
        queries: {
            getCountriesQuery: GET_COUNTRIES_QUERY
        }
    });
    const { countries, loading } = talonProps;
    const { classes: propClasses, validate } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <Field id="country" label="Country" classes={{ root: classes.root }}>
            <Select
                disabled={loading}
                field="country"
                items={countries}
                validate={validate}
            />
        </Field>
    );
};

export default Country;
