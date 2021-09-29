import React from 'react';
import defaultClasses from './divider.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { arrayOf, shape, string } from 'prop-types';

/**
 * Page Builder Divider component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Divider
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Divider.
 */
const Divider = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        width,
        color,
        thickness,
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
        cssClasses = []
    } = props;

    const dynamicStyles = {
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
        paddingLeft
    };
    const hrStyles = {
        width,
        borderColor: color,
        borderWidth: thickness
    };
    return (
        <div style={dynamicStyles} className={cssClasses.join(' ')}>
            <hr style={hrStyles} className={classes.hr} />
        </div>
    );
};

/**
 * Props for {@link Divider}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Divider
 * @property {String} classes.hr CSS classes for the hr element
 * @property {String} width Width of the divider
 * @property {String} color Color of the divider
 * @property {String} thickness Thickness of the divider
 * @property {String} textAlign Alignment of the divider within the parent container
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
Divider.propTypes = {
    classes: shape({
        hr: string
    }),
    width: string,
    color: string,
    thickness: string,
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
    cssClasses: arrayOf(string)
};

export default Divider;
