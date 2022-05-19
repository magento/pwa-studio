import React from 'react';
import { node, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './errorMessage.module.css';

const ErrorMessage = React.forwardRef((props, ref) => {
    const { children } = props;

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} ref={ref} data-cy="ErrorMessage-root">
            <span
                className={classes.errorMessage}
                data-cy="ErrorMessage-errorMessage"
            >
                {children}
            </span>
        </div>
    );
});

export default ErrorMessage;

ErrorMessage.propTypes = {
    classes: shape({
        root: string,
        errorMessage: string
    }),
    children: node
};
