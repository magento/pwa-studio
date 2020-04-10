import React from 'react';
import { func, shape, string } from 'prop-types';
import { useRegion } from '@magento/peregrine/lib/talons/Region/useRegion';

import { mergeClasses } from '../../classify';
import Field from '../Field';
import Select from '../Select';
import TextInput from '../TextInput';
import defaultClasses from './region.css';
import { GET_REGIONS_QUERY } from './region.gql';

const Region = props => {
    const talonProps = useRegion({
        queries: { getRegionsQuery: GET_REGIONS_QUERY }
    });
    const { regions } = talonProps;
    const { classes: propClasses, field, label, validate } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const regionProps = {
        field,
        validate
    };
    const regionField = regions.length ? (
        <Select {...regionProps} items={regions} />
    ) : (
        <TextInput {...regionProps} />
    );

    return (
        <Field id={field} label={label} classes={{ root: classes.root }}>
            {regionField}
        </Field>
    );
};

export default Region;

Region.defaultProps = {
    field: 'region',
    label: 'State'
};

Region.propTypes = {
    classes: shape({
        root: string
    }),
    field: string,
    label: string,
    validate: func
};
