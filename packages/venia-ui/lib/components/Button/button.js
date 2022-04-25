import React, { useRef } from 'react';
import { useButton } from 'react-aria';
import { oneOf, shape, string, bool, elementType } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './button.module.css';

const getRootClassName = (design, size, iconOnly) => {
    return `root_${design}${iconOnly ? '_iconOnly' : `_${size}`}`;
};

/**
 * A component for buttons.
 *
 * @typedef Button
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single button.
 */
const Button = props => {
    const {
        ariaLabel,
        children,
        classes: propClasses,
        design,
        leftIcon,
        rightIcon,
        size,
        disabled,
        onPress,
        ...restProps
    } = props;

    const buttonRef = useRef();

    const { buttonProps } = useButton(
        {
            isDisabled: disabled,
            onPress,
            ...restProps
        },
        buttonRef
    );

    const classes = useStyle(defaultClasses, propClasses);

    const iconOnly = !children;

    const rootClassName = classes[getRootClassName(design, size, iconOnly)];

    const textContent = children ? (
        <span className={classes.text}>{children}</span>
    ) : (
        ''
    );

    return (
        <button
            aria-label={ariaLabel}
            ref={buttonRef}
            className={rootClassName}
            {...buttonProps}
            {...restProps}
        >
            <span className={classes.content}>
                {leftIcon}
                {textContent}
                {rightIcon}
            </span>
        </button>
    );
};

/**
 * Props for {@link Button}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * Button component.
 * @property {string} classes.content classes for the button content
 * @property {string} classes.root classes for root container
 * @property {string} classes.root_highPriority classes for Button if
 * high priority.
 * @property {string} classes.root_lowPriority classes for Button if
 * low priority.
 * @property {string} classes.root_normalPriority classes for Button if
 * normal priority.
 * @property {string} design the type of button design. Allowed values are: 'primary', 'secondary', 'tertiary'
 * @property {elementType} leftIcon React component that renders the left icon
 * @property {elementType} rightIcon React component that renders the right icon
 * @property {string} size Button size. Allowed values are: 'large', 'medium', 'small'
 * @property {string} type the type of the Button. Allowed values are: 'button', 'reset', 'submit'
 * @property {bool} disabled is the button disabled
 */
Button.propTypes = {
    ariaLabel: string.isRequired,
    classes: shape({
        content: string,
        root: string,
        root_highPriority: string,
        root_lowPriority: string,
        root_normalPriority: string
    }),
    design: oneOf(['primary', 'secondary', 'tertiary']).isRequired,
    leftIcon: elementType,
    rightIcon: elementType,
    size: oneOf(['large', 'medium', 'small']),
    type: oneOf(['button', 'reset', 'submit']).isRequired,
    disabled: bool
};

Button.defaultProps = {
    design: 'secondary',
    size: 'medium',
    type: 'button',
    disabled: false
};

export default Button;
