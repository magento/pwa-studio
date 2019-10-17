import React, { useEffect, useRef, useState } from 'react';
import defaultClasses from './row.css';
import { verticalAlignmentToFlex } from '../../utils';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, oneOf, shape, bool, string, number } from 'prop-types';
import { jarallax } from 'jarallax';
import { resourceUrl } from '@magento/venia-drivers';

/**
 * Page Builder Row component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Row
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Row which contains content.
 */
const Row = props => {
    const backgroundElement = useRef(null);
    const [bgImageStyle, setBgImageStyle] = useState(null);
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        appearance = 'contained',
        verticalAlignment,
        minHeight,
        backgroundColor,
        desktopImage,
        mobileImage,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat,
        enableParallax,
        parallaxSpeed = 0.5,
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
        cssClasses = []
    } = props;

    let image = desktopImage;
    if (
        mobileImage &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(max-width: 768px)').matches
    ) {
        image = mobileImage;
    }
    const dynamicStyles = {
        minHeight,
        backgroundColor,
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

    if (image) {
        dynamicStyles.backgroundImage = bgImageStyle;
        dynamicStyles.backgroundSize = backgroundSize;
        dynamicStyles.backgroundPosition = backgroundPosition;
        dynamicStyles.backgroundAttachment = backgroundAttachment;
        dynamicStyles.backgroundRepeat = backgroundRepeat
            ? 'repeat'
            : 'no-repeat';
    }

    if (verticalAlignment) {
        dynamicStyles.display = 'flex';
        dynamicStyles.justifyContent = verticalAlignmentToFlex(
            verticalAlignment
        );
        dynamicStyles.flexDirection = 'column';
    }

    // Full width and contained appearance
    if (appearance === 'contained') {
        cssClasses.push(classes.contained);
    }

    let children = props.children;
    if (appearance === 'full-width') {
        children = <div className={classes.contained}>{children}</div>;
    }

    // Determine the containers width and optimize the image
    useEffect(() => {
        // Intelligently resize cover background images
        if (image && backgroundElement.current) {
            if (backgroundSize === 'cover') {
                let elementWidth = backgroundElement.current.offsetWidth;
                let elementHeight = backgroundElement.current.offsetHeight;
                // If parallax is enabled resize at a higher resolution, as the image will be zoomed
                if (enableParallax) {
                    elementWidth = Math.round(elementWidth * 1.25);
                    elementHeight = Math.round(elementHeight * 1.25);
                }
                setBgImageStyle(
                    `url(${resourceUrl(image, {
                        type: 'image-wysiwyg',
                        width: elementWidth,
                        height: elementHeight,
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
    }, [enableParallax, image, setBgImageStyle]);

    // Initiate jarallax for Parallax
    useEffect(() => {
        let parallaxElement;
        if (enableParallax && bgImageStyle) {
            parallaxElement = backgroundElement.current;
            jarallax(parallaxElement, {
                speed: parallaxSpeed,
                imgSize: backgroundSize,
                imgPosition: backgroundPosition,
                imgRepeat: backgroundRepeat ? 'repeat' : 'no-repeat'
            });
        }

        return () => {
            if (enableParallax && parallaxElement && bgImageStyle) {
                jarallax(parallaxElement, 'destroy');
            }
        };
    }, [bgImageStyle, enableParallax, parallaxSpeed]);

    return (
        <div
            ref={backgroundElement}
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            {children}
        </div>
    );
};

/**
 * Props for {@link Row}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Row
 * @property {String} classes.contained CSS class for the contained appearance element
 * @property {String} classes.root CSS class for the row root element
 * @property {String} minHeight CSS minimum height property
 * @property {String} backgroundColor CSS background-color property
 * @property {String} desktopImage Background image URL to be displayed on desktop devices
 * @property {String} mobileImage Background image URL to be displayed on mobile devices
 * @property {String} backgroundSize CSS background-size property
 * @property {String} backgroundPosition CSS background-position property
 * @property {String} backgroundAttachment CSS background-attachment property
 * @property {Boolean} backgroundRepeat CSS background-repeat property
 * @property {Boolean} enableParallax Enable parallax on this row
 * @property {Number} parallaxSpeed The speed which Parallax should scroll, from -1.0 to 2.0
 * @property {String} textAlign Alignment of content within the row
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Row.propTypes = {
    classes: shape({
        root: string,
        contained: string
    }),
    appearance: oneOf(['contained', 'full-width', 'full-bleed']),
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
    minHeight: string,
    backgroundColor: string,
    desktopImage: string,
    mobileImage: string,
    backgroundSize: string,
    backgroundPosition: string,
    backgroundAttachment: string,
    backgroundRepeat: bool,
    enableParallax: bool,
    parallaxSpeed: number,
    textAlign: string,
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
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Row;
