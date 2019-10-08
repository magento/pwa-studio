import React, { Children } from 'react';
import defaultClasses from './buttons.css';
import { oneOf, arrayOf, string, bool, shape } from 'prop-types';
import { mergeClasses } from '../../../../../classify';

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
    const classes = mergeClasses(defaultClasses, props.classes);

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
    const sameWidthClassName =
        classes[`${isSameWidth ? 'same_width' : undefined}`];

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
        paddingLeft
    };

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

    let largestWidth = 0;
    if (isSameWidth) {
        const totalChildren = Children.count(children);

        Children.map(children, (child, index) => {
            const newProps = child.props;

            const allDone = new Promise(resolve => {
                if (index + 1 === totalChildren) {
                    resolve('done');
                }
            });

            newProps.data.renderCallback = (width, changeWidth) => {
                largestWidth = largestWidth > width ? largestWidth : width;
                allDone.then(changeWidth(largestWidth));
            };

            return child;
        });
    }

    return (
        <div
            style={dynamicStyles}
            className={[
                classes.root,
                appearanceClassName,
                sameWidthClassName,
                ...cssClasses
            ].join(' ')}
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
 * @property {String} classes.same_width CSS class represents Buttons container having buttons with the same width
 * @property {Boolean} isSameWidth Toggles buttons to have the same width inside the Buttons container
 * @property {String} textAlign Horisontal alignment of the contents within the parent container
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
        inline: string,
        same_width: string
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
