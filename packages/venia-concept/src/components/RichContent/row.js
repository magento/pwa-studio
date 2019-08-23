import React from 'react';
import defaultClasses from './row.css';
import classify from 'src/classify';

const Row = ({classes, minHeight, backgroundColor, desktopImage, mobileImage, backgroundSize, backgroundPosition, backgroundAttachment, backgroundRepeat, children}) => {
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
        backgroundRepeat: backgroundRepeat ? 'repeat' : 'no-repeat'
    };
    return (
        <div data-content-type="row" style={dynamicStyles} className={classes.contained}>
            {children}
        </div>
    );
};

export default classify(defaultClasses)(Row);
