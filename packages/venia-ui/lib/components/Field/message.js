import React from 'react';
import { useIntl } from 'react-intl';
import { node, number, oneOfType, shape, string } from 'prop-types';

import defaultClasses from './message.module.css';
import { useStyle } from '../../classify';

const Message = props => {
    const { children, classes: propClasses, fieldState } = props;
    const { formatMessage } = useIntl();
    const { error } = fieldState;

    const classes = useStyle(defaultClasses, propClasses);
    const className = error ? classes.root_error : classes.root;
    let translatedErrorMessage;

    if (error) {
        translatedErrorMessage = formatMessage(
            {
                id: error.id,
                defaultMessage: error.defaultMessage
            },
            { value: error.value }
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
        error: shape({
            id: string,
            defaultMessage: string,
            value: oneOfType([number, string])
        })
    })
};
