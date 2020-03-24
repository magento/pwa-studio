import React from 'react';
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
    const { classes: propClasses, validate } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const regionProps = {
        field: 'region',
        validate
    };
    const regionField = regions.length ? (
        <Select {...regionProps} items={regions} />
    ) : (
        <TextInput {...regionProps} />
    );

    return (
        <Field id="region" label="State" classes={{ root: classes.root }}>
            {regionField}
        </Field>
    );
};

export default Region;
