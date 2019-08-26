import React from 'react';
import defaultClasses from './column.css';
import classify from 'src/classify';

const Column = ({
    appearance,
    classes,
    minHeight,
    verticalAlignment,
    textAlign,
    display,
    width,
    justifyContent,
    flexDirection,
    alignSelf,
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
    let image = desktopImage;
    if (mobileImage && window.matchMedia('(max-width: 768px)').matches) {
        image = mobileImage;
    }
    const dynamicStyles = {
        minHeight: minHeight,
        backgroundColor: backgroundColor,
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
            data-content-type="column"
            style={dynamicStyles}
            className={[classes.pageBuilderColumn, ...cssClasses].join(' ')}
        >
            {children}
        </div>
    );
};

export default classify(defaultClasses)(Column);
