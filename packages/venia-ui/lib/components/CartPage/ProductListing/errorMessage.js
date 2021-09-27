import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';
import { useStyle } from '../../../classify';
import defaultClasses from './errorMessage.css';

const ErrorMessage = props => {
    const { error } = props;
    const classes = useStyle(defaultClasses, props.classes);

    if (!error || !error.message) {
        return null;
    }

    const errorText = error.message.includes('qty') ? (
        <FormattedMessage
            id="stockStatusMessage.message"
            defaultMessage="An item in your cart is currently out-of-stock and must be removed in order to Checkout."
        />
    ) : (
        error.message
    );

    return <div className={classes.root}>{errorText}</div>;
};

ErrorMessage.defaultProps = {
    classes: null,
    error: null
};

ErrorMessage.propTypes = {
    classes: shape({
        root: string
    }),
    error: shape({
        message: string
    })
};

export default ErrorMessage;
