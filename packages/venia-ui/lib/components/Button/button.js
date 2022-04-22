import React, { useRef } from 'react';
import { useButton } from 'react-aria';
import { oneOf, shape, string, bool } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './button.module.css';

const getRootClassName = (design, size) => {
    return `root_${design}_${size}`;
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
    const rootClassName = classes[getRootClassName(design, size)];

    return (
        <button
            aria-label={ariaLabel}
            ref={buttonRef}
            className={rootClassName}
            {...buttonProps}
            {...restProps}
        >
            <span className={classes.content}>{children}</span>
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
 * @property {string} design the type of button design
 * @property {string} type the type of the Button
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
