import React from 'react';

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
    const headingProps = {
        ...rest,
        className: classes.root
    };

    return React.createElement(elementType, headingProps, children);
};

export default Heading;
