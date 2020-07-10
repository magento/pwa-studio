import React, { useEffect, useRef } from 'react';
import { arrayOf, bool, instanceOf, shape, string } from 'prop-types';
import { useFormError } from '@magento/peregrine/lib/talons/FormError/useFormError';

import { mergeClasses } from '../../classify';
import defaultClasses from './formError.css';

const FormError = props => {
    const { classes: propClasses, errors, scrollOnError } = props;

    const talonProps = useFormError({ errors });
    const { errorMessage } = talonProps;

    const errorRef = useRef(null);

    useEffect(() => {
        if (scrollOnError && errorMessage) {
            errorRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [errorMessage, scrollOnError]);

    const classes = mergeClasses(defaultClasses, propClasses);

    return errorMessage ? (
        <div className={classes.root} ref={errorRef}>
            <span className={classes.errorMessage}>{errorMessage}</span>
        </div>
    ) : null;
};

export default FormError;

FormError.propTypes = {
    classes: shape({
        root: string,
        errorMessage: string
    }),
    errors: arrayOf(instanceOf(Error)),
    scrollOnError: bool
};

FormError.defaultProps = {
    scrollOnError: true
};
