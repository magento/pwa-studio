import React, { useRef, useLayoutEffect } from 'react';
import defaultClasses from './buttons.module.css';
import { oneOf, arrayOf, string, bool, shape } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';

/**
 * Page Builder Buttons component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Buttons
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that wraps {@link ButtonItem} components.
 */
const Buttons = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        appearance,
        isSameWidth,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        children,
        cssClasses = []
    } = props;

    const appearanceClassName = classes[`${appearance}`];

    const ref = useRef(null);
    const [minWidth, setMinWidth] = React.useState(0);

    const cssCustomProps = {
        '--buttonMinWidth': minWidth ? minWidth + 'px' : null
    };

    const dynamicStyles = {
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        ...cssCustomProps
    };

    useLayoutEffect(() => {
        if (!isSameWidth) {
            return;
        }

        const { current: el } = ref;
        let min = 0;
        for (const button of el.querySelectorAll('button')) {
            const { offsetWidth } = button;
            if (offsetWidth > min) min = offsetWidth;
        }
        setMinWidth(min);
    }, [isSameWidth]);

    const justifyMap = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
    };

    dynamicStyles.justifyContent = 'flex-start';
    if (textAlign) {
        dynamicStyles.justifyContent = justifyMap[textAlign] || 'flex-start';
        dynamicStyles.textAlign = textAlign;
    }

    return (
        <div
            ref={ref}
            style={dynamicStyles}
            className={[classes.root, appearanceClassName, ...cssClasses].join(
                ' '
            )}
        >
            {children}
        </div>
    );
};

/**
 * Props for {@link Buttons}
 *
 * @typedef props
 *
 * @property {String} appearance Sets buttons placement option
 * @property {Object} classes An object containing the class names for the Buttons
 * @property {String} classes.root CSS classes for the root container element
 * @property {String} classes.stacked CSS class represents 'stacked' buttons placement option
 * @property {String} classes.inline CSS class represents 'inline' buttons placement option
 * @property {Boolean} isSameWidth Toggles buttons to have the same width inside the Buttons container
 * @property {String} textAlign Horizontal alignment of the contents within the parent container
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Buttons.propTypes = {
    appearance: oneOf(['inline', 'stacked']),
    classes: shape({
        root: string,
        stacked: string,
        inline: string
    }),
    isSameWidth: bool,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Buttons;
