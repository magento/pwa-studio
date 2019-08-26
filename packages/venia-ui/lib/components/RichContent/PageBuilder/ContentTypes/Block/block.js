import React from 'react';
import RichContent from '../../../richContent';

const Block = ({
    richContent,
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
    return (
        <div style={dynamicStyles} className={cssClasses}>
            <RichContent html={richContent} />
        </div>
    );
};

export default Block;
