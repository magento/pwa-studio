import React, { useEffect, useState } from 'react';
import { oneOf, shape, string, bool } from 'prop-types';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Button/button.css';

const storage = new BrowserPersistence();

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

    const storeCode = storage.getItem('store_view_code');
    const [css, setCss] = useState(defaultClasses);
    useEffect(() => {
        if (storeCode === 'fr') {
            loadCss();
        }

        async function loadCss () {
            const dynamicCss = await import('./frenchButton.css');
            setCss(dynamicCss.default)
        }
    }, [storeCode]);

    const classes = mergeClasses(css, propClasses);
    const rootClassName = classes[getRootClassName(priority, negative)];

    return (
        <button
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
