import React from 'react';
import { func, shape, string } from 'prop-types';
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
    const { classes: propClasses, field, label, ...inputProps } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const selectProps = {
        classes,
        disabled: loading,
        field,
        items: countries,
        ...inputProps
    };

    return (
        <Field id={field} label={label} classes={{ root: classes.root }}>
            <Select {...selectProps} />
        </Field>
    );
};

export default Country;

Country.defaultProps = {
    field: 'country',
    label: 'Country'
};

Country.propTypes = {
    classes: shape({
        root: string
    }),
    field: string,
    label: string,
    validate: func,
    initialValue: string
};
