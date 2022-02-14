import React, { useEffect, useState, useRef } from 'react';
import defaultClasses from './column.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { arrayOf, oneOf, shape, string, object } from 'prop-types';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useMediaQuery } from '@magento/peregrine/lib/hooks/useMediaQuery';

const { matchMedia } = globalThis;

/**
 * Page Builder Column component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Column
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Column.
 */
const Column = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [bgImageStyle, setBgImageStyle] = useState(null);
    const columnElement = useRef(null);
    const {
        appearance,
        backgroundAttachment,
        backgroundColor,
        backgroundPosition,
        backgroundRepeat = 'repeat',
        backgroundSize,
        border,
        borderColor,
        borderRadius,
        borderWidth,
        children,
        cssClasses = [],
        desktopImage,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        mediaQueries,
        minHeight,
        mobileImage,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        textAlign,
        verticalAlignment,
        width
    } = props;

    const { styles: mediaQueryStyles } = useMediaQuery({ mediaQueries });

    let image = desktopImage;
    if (mobileImage && matchMedia && matchMedia('(max-width: 768px)').matches) {
        image = mobileImage;
    }

    const flexDirection = 'column';
    const display = 'flex';

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
        alignSelf,
        backgroundColor,
        border,
        borderColor,
        borderRadius,
        borderWidth,
        display,
        flexDirection,
        justifyContent,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        minHeight,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        textAlign,
        verticalAlignment,
        width
    };

    if (image) {
        dynamicStyles.backgroundImage = bgImageStyle;
        dynamicStyles.backgroundSize = backgroundSize;
        dynamicStyles.backgroundPosition = backgroundPosition;
        dynamicStyles.backgroundAttachment = backgroundAttachment;
        dynamicStyles.backgroundRepeat = backgroundRepeat;
    }

    // Determine the containers width and optimize the image
    useEffect(() => {
        if (image && columnElement.current) {
            if (backgroundSize === 'cover') {
                setBgImageStyle(
                    `url(${resourceUrl(image, {
                        type: 'image-wysiwyg',
                        width: columnElement.current.offsetWidth,
                        height: columnElement.current.offsetHeight,
                        quality: 85,
                        crop: false,
                        fit: 'cover'
                    })})`
                );
            } else {
                setBgImageStyle(
                    `url(${resourceUrl(image, {
                        type: 'image-wysiwyg',
                        quality: 85
                    })})`
                );
            }
        }
    }, [backgroundSize, image, setBgImageStyle]);

    return (
        <div
            style={{ ...dynamicStyles, ...mediaQueryStyles }}
            ref={columnElement}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            {children}
        </div>
    );
};

/**
 * Props for {@link Column}
 *
 * @typedef props
 *
 * @property {String} appearance Converts to CSS align-self sub-property of the flexbox item
 * @property {String} backgroundAttachment CSS background-attachment property
 * @property {String} backgroundColor CSS background-color property
 * @property {String} backgroundPosition CSS background-position property
 * @property {String} backgroundRepeat CSS background-repeat property
 * @property {String} backgroundSize CSS background-size property
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderRadius CSS border radius property
 * @property {String} borderWidth CSS border width property
 * @property {Object} classes An object containing the class names for the Column
 * @property {String} classes.root CSS classes for the root container element
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 * @property {String} desktopImage Background image url to be used for desktop screen width
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginTop CSS margin top property
 * @property {String} maxWidth Maximum width of the video
 * @property {Array} mediaQueries List of media query rules to be applied to the component
 * @property {String} minHeight - CSS min-height property
 * @property {String} mobileImage Background image url to be used for mobile screen width
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingTop CSS padding top property
 * @property {String} textAlign Horisontal alignment of the contents within the parent container
 * @property {String} verticalAlignment Vertical alignment of the contents within the parent container
 * @property {String} width CSS width property
 */
Column.propTypes = {
    appearance: oneOf([
        'align-top',
        'align-center',
        'align-bottom',
        'full-height'
    ]),
    backgroundAttachment: string,
    backgroundColor: string,
    backgroundPosition: string,
    backgroundRepeat: string,
    backgroundSize: string,
    border: string,
    borderColor: string,
    borderRadius: string,
    borderWidth: string,
    classes: shape({
        root: string
    }),
    cssClasses: arrayOf(string),
    desktopImage: string,
    marginBottom: string,
    marginLeft: string,
    marginRight: string,
    marginTop: string,
    mediaQueries: arrayOf(
        shape({
            media: string,
            style: object
        })
    ),
    minHeight: string,
    mobileImage: string,
    paddingBottom: string,
    paddingRight: string,
    paddingTop: string,
    textAlign: string,
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
    width: string
};

export default Column;
