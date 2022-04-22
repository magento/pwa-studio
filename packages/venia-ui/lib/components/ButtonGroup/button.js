import React from 'react';
import { elementType, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './button.module.css';

const Button = props => {
    const {
        active,
        ariaLabel,
        leftIcon,
        rightIcon,
        text,
        classes: propClasses,
        ...rest
    } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const className = active ? classes.rootActive : classes.rootStandard;

    const textContent = text ? (
        <span className={classes.text}>{text}</span>
    ) : (
        ''
    );

    return (
        <button {...rest} aria-label={ariaLabel} className={className}>
            <span className={classes.content}>
                {leftIcon}
                {textContent}
                {rightIcon}
            </span>
        </button>
    );
};

Button.propTypes = {
    active: Boolean,
    ariaLabel: string.isRequired,
    classes: shape({
        content: string,
        root: string
    }).isRequired,
    key: string.isRequired,
    leftIcon: elementType,
    rightIcon: elementType,
    text: string
};

Button.defaultProps = {
    active: false
};

export default Button;
