import React, { useEffect, useRef } from 'react';
import { func, shape, string } from 'prop-types';
import { useFieldApi, useFieldState } from 'informed';

import { mergeClasses } from '../../classify';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './postcode.css';

const Postcode = props => {
    const { classes: propClasses, fieldInput, label, ...inputProps } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const postcodeProps = {
        classes,
        ...inputProps
    };

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
        <Field id={fieldInput} label={label} classes={{ root: classes.root }}>
            <TextInput {...postcodeProps} field={fieldInput} />
        </Field>
    );
};

export default Postcode;

Postcode.defaultProps = {
    fieldInput: 'postcode',
    label: 'ZIP / Postal Code'
};

Postcode.propTypes = {
    classes: shape({
        root: string
    }),
    fieldInput: string,
    label: string,
    validate: func,
    initialValue: string
};
