import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './text.module.css';
import { useHistory } from 'react-router-dom';
import handleHtmlContentClick from '../../handleHtmlContentClick';

import htmlStringImgUrlConverter from '@magento/peregrine/lib/util/htmlStringImgUrlConverter';

const toHTML = str => ({ __html: htmlStringImgUrlConverter(str) });

/**
 * Page Builder Text component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Text
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Text content type which contains content.
 */
const Text = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        content,
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

    const history = useHistory();

    const clickHandler = event => {
        handleHtmlContentClick(history, event);
    };

    return (
        <div
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
            dangerouslySetInnerHTML={toHTML(content)}
            onClick={clickHandler}
            onKeyDown={clickHandler}
            role="presentation"
        />
    );
};

/**
 * Props for {@link Text}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Text
 * @property {String} classes.root CSS class for the root text element
 * @property {String} content Content to be rendered within the content type
 * @property {String} textAlign Alignment of content within the text
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
Text.propTypes = {
    classes: shape({
        root: string
    }),
    content: string,
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

export default Text;
