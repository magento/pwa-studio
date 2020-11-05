import React, { useEffect, useState } from 'react';
import { oneOf, shape, string, bool } from 'prop-types';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Button/button.css';

const storage = new BrowserPersistence();

const getRootClassName = (priority, negative) =>
    `root_${priority}Priority${negative ? 'Negative' : ''}`;

// The hook that loads/returns custom css for a theme.
const useThemedCss = defaultClasses => {
    const storeCode = storage.getItem('store_view_code');
    const [css, setCss] = useState(defaultClasses);
    useEffect(() => {
        loadCss(storeCode);

        async function loadCss(storeCode) {
            let dynamicCss;
            if (storeCode === 'fr') {
                dynamicCss = await import('./frenchButton.css');
            }
            // etc, for store codes, or whatever store_code:theme mapping you
            setCss(dynamicCss.default);
        }
    }, [storeCode]);

    return css;
};

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
    const classes = mergeClasses(useThemedCss(defaultClasses), propClasses);
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
