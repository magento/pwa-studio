import React from 'react';
import { arrayOf, string } from 'prop-types';

/**
 * Page Builder ExampleQuote component.
 *
 * This component is a custom Page Builder content type. It can be consumed without Page Builder.
 *
 * @typedef ExampleQuote
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that renders an ExampleQuote with optional styling properties.
 */
const ExampleQuote = props => {
    const {
        quoteText,
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
    const className = cssClasses.length ? cssClasses.join(' ') : null;
    return (
        <div>
            <blockquote class="quote-content">{text}</blockquote>
            <div class="quote-author"></div>
            <div class="quote-description"></div>
        </div>
        <HeadingType style={dynamicStyles} className={className}>

        </HeadingType>
    );
};

/**
 * Props for {@link ExampleQuote}
 *
 * @typedef props
 *
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
ExampleQuote.propTypes = {
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

export default ExampleQuote;
