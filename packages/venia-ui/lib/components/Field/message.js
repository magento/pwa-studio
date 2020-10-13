import React from 'react';
import { useIntl } from 'react-intl';
import { node, shape, string } from 'prop-types';

import defaultClasses from './message.css';
import { mergeClasses } from '../../classify';

const Message = props => {
    const { children, classes: propClasses, fieldState } = props;
    const { formatMessage } = useIntl();
    const { asyncError, error } = fieldState;
    const errorMessage = error || asyncError;

    const classes = mergeClasses(defaultClasses, propClasses);
    const className = errorMessage ? classes.root_error : classes.root;
    let translatedErrorMessage;

    if (errorMessage) {
        translatedErrorMessage = formatMessage(
            {
                id: errorMessage.id,
                defaultMessage: errorMessage.defaultMessage
            },
            { value: errorMessage.value }
        );
    }

    return <p className={className}>{translatedErrorMessage || children}</p>;
};

export default Message;

Message.defaultProps = {
    fieldState: {}
};

Message.propTypes = {
    children: node,
    classes: shape({
        root: string,
        root_error: string
    }),
    fieldState: shape({
        asyncError: string,
        error: shape({
            id: string,
            defaultMessage: string,
            value: string
        })
    })
};
