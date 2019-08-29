import React from 'react';
import defaultClasses from './column.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, oneOf, shape, string, bool } from 'prop-types';

const Column = ({
    classes,
    appearance,
    minHeight,
    verticalAlignment,
    textAlign,
    width,
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

    const flexDirection = 'column',
        display = 'flex';

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

    let justifyContent;

    switch (verticalAlignment) {
        case 'top':
        default:
            justifyContent = 'flex-start';
            break;
        case 'middle':
            justifyContent = 'center';
            break;
        case 'bottom':
            justifyContent = 'flex-end';
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

Column.propTypes = {
    classes: shape({
        pagebuilderColumn: string
    }),
    appearance: oneOf([
        'align-top',
        'align-center',
        'align-bottom',
        'full-height'
    ]),
    minHeight: string,
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
    textAlign: string,
    width: string,
    backgroundColor: string,
    desktopImage: string,
    mobileImage: string,
    backgroundSize: string,
    backgroundPosition: string,
    backgroundAttachment: string,
    backgroundRepeat: bool,
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
