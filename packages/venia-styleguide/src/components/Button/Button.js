import React, { useLayoutEffect, useMemo, useRef } from 'react';

import finalizeClasses from '../../util/finalizeClasses';
import classes from './Button.css';

const Button = props => {
    const { children, priority, ...rest } = props;
    const ref = useRef();

    const finalClasses = useMemo(() => {
        return finalizeClasses(classes, { priority });
    }, [priority]);

    useLayoutEffect(() => {
        const { current } = ref;

        current.style.setProperty('--height', current.offsetHeight);
    });

    return (
        <button {...rest} ref={ref} className={finalClasses.get('root')}>
            <span className={classes.content}>{children}</span>
        </button>
    );
};

export default Button;

Button.defaultProps = {
    priority: 'normal',
    type: 'button'
};
