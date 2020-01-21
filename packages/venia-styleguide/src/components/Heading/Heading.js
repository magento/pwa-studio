import React, { useMemo } from 'react';

import finalizeClasses from '../../util/finalizeClasses';
import classes from './Heading.css';

const getElementType = level => {
    const isInteger = Number.isSafeInteger(level);
    const isValid = level > 0 && level < 7;
    const finalLevel = isInteger && isValid ? level : 1;

    return `h${finalLevel}`;
};

const Heading = props => {
    const { children, level, ...rest } = props;
    const elementType = getElementType(level);

    const finalClasses = useMemo(() => {
        return finalizeClasses(classes, { level });
    }, [level]);

    const headingProps = {
        ...rest,
        className: finalClasses.get('root')
    };

    return React.createElement(elementType, headingProps, children);
};

export default Heading;
