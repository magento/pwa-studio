import React from 'react';
import defaultClasses from './row.css';
import classify from 'src/classify';

const Row = ({classes, minHeight, backgroundColor, desktopImage, mobileImage, backgroundSize, backgroundPosition, backgroundAttachment, backgroundRepeat, border, borderColor, borderWidth, borderRadius, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft, cssClasses, children}) => {
    let image = desktopImage;
    if (mobileImage && window.matchMedia('(max-width: 768px)').matches) {
        image = mobileImage;
    }
    const dynamicStyles = {
        minHeight: minHeight,
        backgroundColor: backgroundColor,
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
    };
    return (
        <div data-content-type="row" style={dynamicStyles} className={[classes.contained, ...[cssClasses]].join(' ')}>
            {children}
        </div>
    );
};

export default classify(defaultClasses)(Row);
