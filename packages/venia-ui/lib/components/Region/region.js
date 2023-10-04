import React from 'react';
import { useIntl } from 'react-intl';
import { func, number, oneOfType, shape, string } from 'prop-types';
import { useRegion } from '@magento/peregrine/lib/talons/Region/useRegion';

import { useStyle } from '../../classify';
import Field from '../Field';
import Select from '../Select';
import TextInput from '../TextInput';
import defaultClasses from './region.module.css';
import { GET_REGIONS_QUERY } from './region.gql';

/**
 * Form component for Region that is seeded with backend data.
 *
 * @param {string} props.optionValueKey - Key to use for returned option values. In a future release, this will be removed and hard-coded to use "id" once GraphQL has resolved MC-30886.
 */
const Region = props => {
    const {
        classes: propClasses,
        regionError,
        countryCodeField,
        fieldInput,
        fieldSelect,
        label,
        translationId,
        optionValueKey,
        ...inputProps
    } = props;
    const { formatMessage } = useIntl();

    const talonProps = useRegion({
        countryCodeField,
        fieldInput,
        fieldSelect,
        optionValueKey,
        queries: { getRegionsQuery: GET_REGIONS_QUERY }
    });
    const { loading, regions } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);
    const regionProps = {
        classes,
        disabled: loading,
        ...inputProps
    };

    const regionField =
        regions.length || loading ? (
            <Select
                regionError={regionError}
                {...regionProps}
                field={fieldSelect}
                id={classes.root}
                items={regions}
            />
        ) : (
            <TextInput
                {...regionProps}
                field={fieldInput}
                id={classes.root}
                regionError={regionError}
            />
        );

    return (
        <Field
            id={classes.root}
            label={formatMessage({ id: translationId, defaultMessage: label })}
            classes={{ root: classes.root }}
        >
            {regionField}
        </Field>
    );
};

export default Region;

Region.defaultProps = {
    countryCodeField: 'country',
    fieldInput: 'region',
    fieldSelect: 'region',
    label: 'State',
    translationId: 'region.label',
    optionValueKey: 'code'
};

Region.propTypes = {
    classes: shape({
        root: string
    }),
    countryCodeField: string,
    fieldInput: string,
    fieldSelect: string,
    label: string,
    translationId: string,
    optionValueKey: string,
    validate: func,
    initialValue: oneOfType([number, string])
};
