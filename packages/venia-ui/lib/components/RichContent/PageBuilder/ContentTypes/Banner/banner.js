import React from 'react';
import defaultClasses from './banner.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, bool, oneOf, shape, string } from 'prop-types';
import Button from "../../../../Button/button";

const toHTML = str => ({ __html: str });

/**
 * Page Builder Banner component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Banner
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Banner.
 */
const Banner = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        appearance = 'poster',
        minHeight,
        backgroundColor,
        desktopImage,
        mobileImage,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        content,
        showButton,
        buttonType,
        buttonText,
        showOverlay,
        overlayColor,
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

    const rootStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };
    const wrapperStyles = {
        backgroundColor,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        textAlign
    };
    const overlayStyles = {
        backgroundColor: showOverlay !== 'never' ? overlayColor : null
    };
    const contentStyles = {};

    if (image) {
        wrapperStyles.backgroundImage = `url(${image})`;
        wrapperStyles.backgroundSize = backgroundSize;
        wrapperStyles.backgroundPosition = backgroundPosition;
        wrapperStyles.backgroundAttachment = backgroundAttachment;
        wrapperStyles.backgroundRepeat = backgroundRepeat
            ? 'repeat'
            : 'no-repeat';
    }

    if (appearance === 'poster') {
        overlayStyles.borderRadius = borderRadius;
        overlayStyles.minHeight = minHeight;
        overlayStyles.paddingTop = paddingTop;
        overlayStyles.paddingRight = paddingRight;
        overlayStyles.paddingBottom = paddingBottom;
        overlayStyles.paddingLeft = paddingLeft;
        contentStyles.width = '100%';
    } else {
        wrapperStyles.minHeight = minHeight;
        wrapperStyles.paddingTop = paddingTop;
        wrapperStyles.paddingRight = paddingRight;
        wrapperStyles.paddingBottom = paddingBottom;
        wrapperStyles.paddingLeft = paddingLeft;
    }

    const appearanceClasses = {
        poster: classes.poster,
        'collage-left': classes.collageLeft,
        'collage-centered': classes.collageCentered,
        'collage-right': classes.collageRight
    };

    const buttonPriorityMap = {
        primary: 'high',
        secondary: 'normal',
        link: 'low'
    };

    let BannerButton;
    if (showButton !== 'never') {
        BannerButton = <div className={classes.button}>
            <Button  priority={buttonPriorityMap[buttonType]}>
                {buttonText}
            </Button>
        </div>;
    }

    return (
        <div
            className={[appearanceClasses[appearance], ...cssClasses].join(' ')}
            style={rootStyles}
        >
            <div className={classes.wrapper} style={wrapperStyles}>
                <div className={classes.overlay} style={overlayStyles}>
                    <div
                        className={classes.content}
                        style={contentStyles}
                        dangerouslySetInnerHTML={toHTML(content)}
                    />
                    {BannerButton}
                </div>
            </div>
        </div>
    );
};

/**
 * Props for {@link Banner}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the banner
 * @property {String} classes.root CSS class for the banner root element
 * @property {String} classes.wrapper CSS class for the banner wrapper element
 * @property {String} classes.overlay CSS class for the banner overlay element
 * @property {String} classes.content CSS class for the banner content element
 * @property {String} classes.poster CSS class for the banner poster appearance
 * @property {String} classes.collageLeft CSS class for the banner collage left appearance
 * @property {String} classes.collageCentered CSS class for the banner collage centered appearance
 * @property {String} classes.collageRight CSS class for the banner collage right appearance
 * @property {String} classes.poster CSS class for the banner poster appearance
 * @property {String} minHeight CSS minimum height property
 * @property {String} backgroundColor CSS background-color property
 * @property {String} desktopImage Background image URL to be displayed on desktop devices
 * @property {String} mobileImage Background image URL to be displayed on mobile devices
 * @property {String} backgroundSize CSS background-size property
 * @property {String} backgroundPosition CSS background-position property
 * @property {String} backgroundAttachment CSS background-attachment property
 * @property {Boolean} backgroundRepeat CSS background-repeat property
 * @property {String} content The HTML content to be rendered inside the banner content area
 * @property {String} link The link location for the banner
 * @property {String} linkType The type of link included with the banner. Values: default, product, category, page
 * @property {String} showButton Whether or not to show the button. Values: always, hover, never
 * @property {String} buttonText Text to display within the button
 * @property {String} buttonType The type of button to display. Values: primary, secondary, link
 * @property {String} showOverlay Whether or not to show the overlay. Values: always, hover, never
 * @property {String} overlayColor The color of the overlay
 * @property {String} textAlign Alignment of the block within the parent container
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
Banner.propTypes = {
    classes: shape({
        root: string,
        wrapper: string,
        overlay: string,
        content: string,
        poster: string,
        collageLeft: string,
        collageCentered: string,
        collageRight: string
    }),
    appearance: oneOf([
        'poster',
        'collage-left',
        'collage-centered',
        'collage-right'
    ]),
    minHeight: string,
    backgroundColor: string,
    desktopImage: string,
    mobileImage: string,
    backgroundSize: string,
    backgroundPosition: string,
    backgroundAttachment: string,
    backgroundRepeat: bool,
    content: string,
    link: string,
    linkType: oneOf(['default', 'product', 'category', 'page']),
    showButton: oneOf(['always', 'hover', 'never']),
    buttonText: string,
    buttonType: oneOf(['primary', 'secondary', 'link']),
    showOverlay: oneOf(['always', 'hover', 'never']),
    overlayColor: string,
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
    cssClasses: arrayOf(string)
};

export default Banner;
