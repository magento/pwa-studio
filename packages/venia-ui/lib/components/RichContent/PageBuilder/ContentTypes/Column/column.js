import React from 'react';
import defaultClasses from './column.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, oneOf, shape, string } from 'prop-types';

const Column = ({
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
    classes = mergeClasses(defaultClasses, classes);
    let image = desktopImage;
    if (mobileImage && window.matchMedia('(max-width: 768px)').matches) {
        image = mobileImage;
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

Column.propTypes = {
    classes: shape({
        pagebuilderColumn: string
    }),
    minHeight: string,
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
    textAlign: string,
    display: string,
    width: string,
    justifyContent: string,
    flexDirection: string,
    alignSelf: string,
    backgroundColor: string,
    desktopImage: string,
    mobileImage: string,
    backgroundSize: string,
    backgroundPosition: string,
    backgroundAttachment: string,
    backgroundRepeat: string,
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

export default Column;
