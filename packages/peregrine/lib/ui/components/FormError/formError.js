import React, { useRef } from 'react';
import { arrayOf, bool, instanceOf, shape, string } from 'prop-types';

import { useFormError } from '@magento/peregrine/lib/talons/FormError/useFormError';
import { useScrollIntoView } from '@magento/peregrine/lib/hooks/useScrollIntoView';

import { useStyle } from '../../classify';
import ErrorMessage from '../ErrorMessage';
import defaultClasses from './formError.module.css';

const FormError = props => {
    const {
        classes: propClasses,
        errors,
        scrollOnError,
        allowErrorMessages
    } = props;

    const talonProps = useFormError({ errors, allowErrorMessages });
    const { errorMessage } = talonProps;

    const errorRef = useRef(null);

    useScrollIntoView(errorRef, scrollOnError && errorMessage);

    const classes = useStyle(defaultClasses, propClasses);

    return errorMessage ? (
        <ErrorMessage classes={classes} ref={errorRef}>
            {errorMessage}
        </ErrorMessage>
    ) : null;
};

export default FormError;

FormError.propTypes = {
    classes: shape({
        root: string,
        errorMessage: string
    }),
    errors: arrayOf(instanceOf(Error)),
    scrollOnError: bool,
    allowErrorMessages: bool
};

FormError.defaultProps = {
    scrollOnError: true
};
