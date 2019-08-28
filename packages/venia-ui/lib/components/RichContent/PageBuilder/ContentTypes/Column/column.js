import React from 'react';
import defaultClasses from './column.css';
import { mergeClasses } from '../../../../../classify';

const Column = ({
    classes,
    appearance,
    minHeight,
    verticalAlignment,
    textAlign,
    display,
    width,
    justifyContent,
    flexDirection,
    backgroundColor,
    desktopImage,
    mobileImage,
    backgroundSize,
    backgroundPosition,
    backgroundAttachment,
    backgroundRepeat,
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
    cssClasses,
    children
}) => {
    classes = mergeClasses(defaultClasses, classes);
    let image = desktopImage;
    if (mobileImage && window.matchMedia('(max-width: 768px)').matches) {
        image = mobileImage;
    }

    let alignSelf;

    switch (appearance) {
        case 'align-top':
            alignSelf = 'flex-start';
            break;
        case 'align-center':
            alignSelf = 'center';
            break;
        case 'align-bottom':
            alignSelf = 'flex-end';
            break;
        case 'full-height':
        default:
            alignSelf = 'stretch';
            break;
    }

    const dynamicStyles = {
        minHeight,
        backgroundColor,
        textAlign,
        display,
        width,
        backgroundImage: image ? `url(${image})` : null,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat: backgroundRepeat ? 'repeat' : 'no-repeat',
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
        verticalAlignment,
        justifyContent,
        flexDirection,
        alignSelf
    };

    return (
        <div
            style={dynamicStyles}
            className={[classes.pageBuilderColumn, ...cssClasses].join(' ')}
        >
            {children}
        </div>
    );
};

export default Column;
