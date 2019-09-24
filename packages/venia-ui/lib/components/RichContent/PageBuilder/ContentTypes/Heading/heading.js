import React from 'react';
import defaultClasses from './heading.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';

/**
 * Page Builder Heading component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Heading
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that renders Heading with optional styling properties.
 */
const Heading = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        headingType,
        text,
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
    const headingTypeClass = classes[headingType];
    const HeadingType = `${headingType}`;
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
    cssClasses.push(classes.heading);
    return (
        <HeadingType
            style={dynamicStyles}
            className={[classes.root, headingTypeClass, ...cssClasses].join(
                ' '
            )}
        >
            {text}
        </HeadingType>
    );
};

/**
 * Props for {@link Heading}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Heading
 * @property {String} classes.root CSS class for the root container element
 * @property {String} classes.headingTypeClass CSS class representing heading type
 * @property {String} headingType Level of HTML heading
 * @property {String} text Heading text
 * @property {String} textAlign Alignment of the text within the parent container
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
Heading.propTypes = {
    classes: shape({
        root: string,
        headingTypeClass: string
    }),
    headingType: string,
    text: string,
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

export default Heading;
