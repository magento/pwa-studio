import React, { useMemo } from 'react';

import finalizeClasses from '../../util/finalizeClasses';
import classes from './Button.css';

const Button = props => {
    const { children, priority } = props;

    const finalClasses = useMemo(() => {
        return finalizeClasses(classes, { priority });
    }, [priority]);

    return (
        <button className={finalClasses.get('root')}>
            <span className={finalClasses.get('content')}>{children}</span>
        </button>
    );
};

export default Button;
