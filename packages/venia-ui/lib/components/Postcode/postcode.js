import React, { useEffect, useRef } from 'react';
import { func, shape, string } from 'prop-types';
import { useFieldApi, useFieldState } from 'informed';
import { useIntl } from 'react-intl';

import { mergeClasses } from '../../classify';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './postcode.css';

const Postcode = props => {
    const {
        classes: propClasses,
        fieldInput,
        label,
        translationId,
        ...inputProps
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const postcodeProps = {
        classes,
        ...inputProps
    };

    const { formatMessage } = useIntl();

    const hasInitialized = useRef(false);
    const countryCodeField = 'country';
    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;

    const postcodeInputFieldApi = useFieldApi(fieldInput);

    useEffect(() => {
        if (country) {
            if (hasInitialized.current) {
                postcodeInputFieldApi.reset();
            } else {
                hasInitialized.current = true;
            }
        }
    }, [country, postcodeInputFieldApi]);

    return (
        <Field
            id={fieldInput}
            label={formatMessage({ id: translationId, defaultMessage: label })}
            classes={{ root: classes.root }}
        >
            <TextInput {...postcodeProps} field={fieldInput} />
        </Field>
    );
};

export default Postcode;

Postcode.defaultProps = {
    fieldInput: 'postcode',
    label: 'ZIP / Postal Code',
    translationId: 'postcode.label'
};

Postcode.propTypes = {
    classes: shape({
        root: string
    }),
    fieldInput: string,
    label: string,
    translationId: string,
    validate: func,
    initialValue: string
};
