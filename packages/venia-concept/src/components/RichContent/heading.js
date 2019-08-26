import React from 'react';

const Heading = ({headingType, text, textAlign, border, borderColor, borderWidth, borderRadius, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft, cssClasses}) => {
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
        paddingLeft,
    };
    return (
        <HeadingType style={dynamicStyles} className={cssClasses}>
            {text}
        </HeadingType>
    );
};

export default Heading;
