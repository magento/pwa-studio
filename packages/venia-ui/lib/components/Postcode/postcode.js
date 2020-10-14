import React from 'react';
import { func, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { usePostcode } from '@magento/peregrine/lib/talons/Postcode/usePostcode';

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

    usePostcode({ fieldInput });

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
