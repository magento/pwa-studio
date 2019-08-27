import React from 'react';
import defaultClasses from './text.css';
import { mergeClasses } from '../../../../../classify';

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
            className={cssClasses}
            dangerouslySetInnerHTML={toHTML(content)}
        />
    );
};

export default Text;
