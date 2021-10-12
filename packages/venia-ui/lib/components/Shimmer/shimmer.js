import React, { useMemo } from 'react';
import { node, number, oneOf, oneOfType, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './shimmer.module.css';

/**
 * @kind functional component
 *
 * @param {Object} classes Styles to apply to the `root` of the Shimmer. Available classes are `root` and `root_[TYPE]`.
 * @param {string|number} borderRadius Border radius for the shimmer.
 * @param {string|number} height Sets the height of the Shimmer. Numbers are in `rem` units. Strings are used directly (Example: '100px').
 * @param {string|number} width Sets the width of the Shimmer. Numbers are in `rem` units. Strings are used directly (Example: '100px').
 * @param {Object} style CSS styles to apply to the Shimmer.
 * @param {'rectangle'|'button'|'checkbox'|'radio'|'textArea'|'textInput'} type The base element shape to apply to the Shimmer.
 * @param {node} children Children to output within the Shimmer. Useful for setting image placeholders.
 */
const Shimmer = props => {
    const {
        classes: propClasses,
        borderRadius,
        height,
        width,
        style: customStyles,
        type,
        children,
        ...restProps
    } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const style = useMemo(() => {
        const combinedStyles = {
            ...customStyles
        };

        Object.entries({ borderRadius, height, width }).forEach(
            ([type, value]) => {
                if (typeof value !== 'undefined') {
                    combinedStyles[type] =
                        typeof value === 'number' ? `${value}rem` : value;
                }
            }
        );

        return combinedStyles;
    }, [customStyles, borderRadius, height, width]);

    const rootClass = `root_${type}`;

    return (
        <div className={classes[rootClass]} style={style} {...restProps}>
            {children}
        </div>
    );
};

/**
 * @property {Object} classes is an object containing the class names for the
 * Shimmer component.
 * @property {string} classes.root is the class for the container
 * @property {string} classes.root_rectangle is the class for the container
 * of type rectangle
 * @property {string} classes.root_button is the class for the container
 * of type button
 * @property {string} classes.root_checkbox is the class for the container
 * of type checkbox
 * @property {string} classes.root_radio is the class for the container
 * of type radio
 * @property {string} classes.root_textArea is the class for the container
 * of type textArea
 * @property {string} classes.root_textInput is the class for the container
 * of type textInput
 * @property {number | string} borderRadius is the border radius of the Shimmer
 * @property {number | string} height is the height of the Shimmer
 * @property {number | string} width is the width of the Shimmer
 * @property {Object} style is an object of inline styles
 * @property {string} type is the type of the Shimmer
 * @property {node} children are the children of the Shimmer
 */
Shimmer.propTypes = {
    classes: shape({
        root: string,
        root_rectangle: string,
        root_button: string,
        root_checkbox: string,
        root_radio: string,
        root_textArea: string,
        root_textInput: string
    }),
    borderRadius: oneOfType([number, string]),
    height: oneOfType([number, string]),
    width: oneOfType([number, string]),
    style: shape({}),
    type: oneOf([
        'rectangle',
        'button',
        'checkbox',
        'radio',
        'textArea',
        'textInput'
    ]),
    children: node
};

Shimmer.defaultProps = {
    style: {},
    type: 'rectangle'
};

export default Shimmer;
