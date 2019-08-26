import React from 'react';
import defaultClasses from './heading.css';
import {mergeClasses} from "../../../../../classify";

const Heading = ({
    classes,
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
    cssClasses
}) => {
    classes = mergeClasses(defaultClasses, classes);
    const HeadingType = `${headingType.toLowerCase()}`;
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
        <HeadingType style={dynamicStyles} className={cssClasses}>
            {text}
        </HeadingType>
    );
};

export default Heading;
