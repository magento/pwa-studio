import React from 'react';
import { useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { useCountry } from '@magento/peregrine/lib/talons/Country/useCountry';

import { useStyle } from '../../classify';
import Field from '../Field';
import Select from '../Select';
import defaultClasses from './country.module.css';
import { GET_COUNTRIES_QUERY } from './country.gql';

const Country = props => {
    const talonProps = useCountry({
        queries: {
            getCountriesQuery: GET_COUNTRIES_QUERY
        }
    });
    const { countries, loading } = talonProps;
    const {
        classes: propClasses,
        field,
        label,
        translationId,
        ...inputProps
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);
    const selectProps = {
        classes,
        disabled: loading,
        field,
        items: countries,
        ...inputProps
    };

    return (
        <Field
            id={classes.root}
            label={formatMessage({ id: translationId, defaultMessage: label })}
            classes={{ root: classes.root }}
        >
            <Select {...selectProps} id={classes.root} />
        </Field>
    );
};

export default Country;

Country.defaultProps = {
    field: 'country',
    label: 'Country',
    translationId: 'country.label'
};

Country.propTypes = {
    classes: shape({
        root: string
    }),
    field: string,
    label: string,
    translationId: string,
    validate: func,
    initialValue: string
};
