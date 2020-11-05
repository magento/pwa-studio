import React from 'react';
import { oneOf, shape, string, bool } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Button/button.css';

import useThemedCss from '@magento/venia-concept/src/ThemedCss/useThemedCss';

const getRootClassName = (priority, negative) =>
    `root_${priority}Priority${negative ? 'Negative' : ''}`;

const CustomButton = props => {
    const {
        children,
        classes: propClasses,
        priority,
        type,
        negative,
        disabled,
        className,
        ...restProps
    } = props;

    // One of two changes to "Button". Wrap "defaultClasses" in `useThemedCss`.
    const classes = mergeClasses(
        useThemedCss('Button', defaultClasses),
        propClasses
    );
    const rootClassName = classes[getRootClassName(priority, negative)];

    return (
        <button
            // The only other custom thing here...But there might be a better
            // way to ensure that incoming classes are used.
            className={`${className} ${rootClassName}`}
            type={type}
            disabled={disabled}
            {...restProps}
        >
            <span className={classes.content}>{children}</span>
        </button>
    );
};

CustomButton.propTypes = {
    classes: shape({
        content: string,
        root: string,
        root_highPriority: string,
        root_lowPriority: string,
        root_normalPriority: string
    }),
    priority: oneOf(['high', 'low', 'normal']).isRequired,
    type: oneOf(['button', 'reset', 'submit']).isRequired,
    negative: bool,
    disabled: bool
};

CustomButton.defaultProps = {
    priority: 'normal',
    type: 'button',
    negative: false,
    disabled: false
};

export default CustomButton;
