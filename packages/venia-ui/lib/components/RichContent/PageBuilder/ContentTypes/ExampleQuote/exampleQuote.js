import React from 'react';
import defaultClasses from './exampleQuote.css';
import { arrayOf, string } from 'prop-types';

const toHTML = str => ({ __html: str });

/**
 * Page Builder ExampleQuote component.
 *
 * This is a custom content type component using the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef ExampleQuote
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that renders ExampleQuote with optional styling properties.
 */
const ExampleQuote = props => {
    const {
        quote,
        author,
        description,
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

    const quoteClasses = [defaultClasses.quote, defaultClasses.blueQuote].join(
        ' '
    );
    console.log(quoteClasses);

    return (
        <div style={dynamicStyles}>
            <div className={quoteClasses}>{quote}</div>
            <div className={defaultClasses.quoteAuthor}>{author}</div>
            <div
                className={defaultClasses.quoteDescription}
                dangerouslySetInnerHTML={toHTML(description)}
            />
        </div>
    );
};

/**
 * Props for {@link ExampleQuote}
 *
 * @typedef props
 *
 * @property {String} quote Text of quotation
 * @property {String} author Name of the quotation's author
 * @property {String} description Description of the author
 * @property {String} text ExampleQuote text
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
    quote: string,
    author: string,
    description: string,
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
