import React from 'react';
import defaultClasses from './text.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';

const toHTML = str => ({ __html: str });

const Text = ({
    classes,
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
    cssClasses
}) => {
    classes = mergeClasses(defaultClasses, classes);
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
    cssClasses.push(classes.text);
    return (
        <div
            style={dynamicStyles}
            className={cssClasses.join(' ')}
            dangerouslySetInnerHTML={toHTML(content)}
        />
    );
};

Text.propTypes = {
    classes: shape({
        text: string
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
