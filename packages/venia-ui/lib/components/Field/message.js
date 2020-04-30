import React from 'react';
import { node, shape, string } from 'prop-types';

import defaultClasses from './message.css';
import { mergeClasses } from '../../classify';

const Message = props => {
    const { children, classes: propClasses, fieldState } = props;
    const { asyncError, error } = fieldState;
    const errorMessage = error || asyncError;

    const classes = mergeClasses(defaultClasses, propClasses);
    const className = errorMessage ? classes.root_error : classes.root;

    return <p className={className}>{errorMessage || children}</p>;
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
        error: string
    })
};
