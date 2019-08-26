import React from 'react';
import defaultClasses from './heading.css';
import classify from 'src/classify';

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

export default classify(defaultClasses)(Heading);
