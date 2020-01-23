import React, { useMemo } from 'react';

import finalizeClasses from '../../util/finalizeClasses';
import classes from './Button.css';

const Button = props => {
    const { children, priority, ...rest } = props;

    const finalClasses = useMemo(() => {
        return finalizeClasses(classes, { priority });
    }, [priority]);

    return (
        <button {...rest} className={finalClasses.get('root')}>
            <span className={classes.content}>{children}</span>
        </button>
    );
};

export default Button;

Button.defaultProps = {
    priority: 'normal',
    type: 'button'
};
