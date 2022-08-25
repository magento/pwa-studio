import React from 'react';
import { bool, node, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './label.module.css';

const Label = props => {
    const { children, plain, ...restProps } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const elementType = plain ? 'span' : 'label';
    const labelProps = {
        ...restProps,
        className: classes.root
    };

    return React.createElement(elementType, labelProps, children);
};

Label.propTypes = {
    children: node,
    classes: shape({
        root: string
    }),
    plain: bool
};

export default Label;
