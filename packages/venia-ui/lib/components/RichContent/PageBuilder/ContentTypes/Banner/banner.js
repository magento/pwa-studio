import React, { useState } from 'react';
import defaultClasses from './banner.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, bool, object, oneOf, shape, string } from 'prop-types';
import Button from '../../../../Button/button';
import resolveLinkProps from '../../resolveLinkProps';
import { Link, withRouter, resourceUrl } from '@magento/venia-drivers';

const toHTML = str => ({ __html: str });

const handleDragStart = event => event.preventDefault();

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
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);
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
        link,
        linkType,
        openInNewTab = false,
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
    if (mobileImage && window.matchMedia('(max-width: 768px)').matches) {
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
        const resourceImage = resourceUrl(image, {
            type: 'image-wysiwyg',
            quality: 85
        });
        wrapperStyles.backgroundImage = `url(${resourceImage})`;
        wrapperStyles.backgroundSize = backgroundSize;
        wrapperStyles.backgroundPosition = backgroundPosition;
        wrapperStyles.backgroundAttachment = backgroundAttachment;
        wrapperStyles.backgroundRepeat = backgroundRepeat
            ? 'repeat'
            : 'no-repeat';
    }

    if (appearance === 'poster') {
        wrapperStyles.minHeight = minHeight;
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

    const appearanceOverlayClasses = {
        poster: classes.posterOverlay,
        'collage-left': classes.collageLeftOverlay,
        'collage-centered': classes.collageCenteredOverlay,
        'collage-right': classes.collageRightOverlay
    };
    const appearanceOverlayHoverClasses = {
        poster: classes.posterOverlayHover,
        'collage-left': classes.collageLeftOverlayHover,
        'collage-centered': classes.collageCenteredOverlayHover,
        'collage-right': classes.collageRightOverlayHover
    };

    const typeToPriorityMapping = {
        primary: 'high',
        secondary: 'normal',
        link: 'low'
    };

    let BannerButton;
    if (showButton !== 'never') {
        const buttonClass =
            showButton === 'hover' ? classes.buttonHover : classes.button;

        BannerButton = (
            <div className={buttonClass}>
                <Button
                    priority={typeToPriorityMapping[buttonType]}
                    type="button"
                >
                    {buttonText}
                </Button>
            </div>
        );
    }

    const overlayClass =
        showOverlay === 'hover' && !hovered
            ? appearanceOverlayHoverClasses[appearance]
            : appearanceOverlayClasses[appearance];

    let BannerFragment = (
        <div className={classes.wrapper} style={wrapperStyles}>
            <div className={overlayClass} style={overlayStyles}>
                <div
                    className={classes.content}
                    style={contentStyles}
                    dangerouslySetInnerHTML={toHTML(content)}
                />
                {BannerButton}
            </div>
        </div>
    );

    if (typeof link === 'string') {
        const linkProps = resolveLinkProps(link, linkType);
        const LinkComponent = linkProps.to ? Link : 'a';
        BannerFragment = (
            <LinkComponent
                className={classes.link}
                {...linkProps}
                {...(openInNewTab ? { target: '_blank' } : '')}
                onDragStart={handleDragStart}
            >
                {BannerFragment}
            </LinkComponent>
        );
    }

    return (
        <div
            className={[classes.root, ...cssClasses].join(' ')}
            style={rootStyles}
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
        >
            {BannerFragment}
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
 * @property {String} classes.link CSS class for the banner link element
 * @property {String} classes.wrapper CSS class for the banner wrapper element
 * @property {String} classes.overlay CSS class for the banner overlay element
 * @property {String} classes.content CSS class for the banner content element
 * @property {String} classes.button CSS class for the banner button wrapping element
 * @property {String} classes.buttonHover CSS class for the banner button wrapping element for hover
 * @property {String} classes.posterOverlay CSS class for the banner poster appearance overlay
 * @property {String} classes.collageLeftOverlay CSS class for the banner collage left appearance overlay
 * @property {String} classes.collageCenteredOverlay CSS class for the banner collage centered appearance overlay
 * @property {String} classes.collageRightOverlay CSS class for the banner collage right appearance overlay
 * @property {String} classes.posterOverlayHover CSS class for the banner poster appearance overlay hover
 * @property {String} classes.collageLeftOverlayHover CSS class for the banner collage left appearance overlay hover
 * @property {String} classes.collageCenteredOverlayHover CSS class for the banner collage centered appearance overlay hover
 * @property {String} classes.collageRightOverlayHover CSS class for the banner collage right appearance overlay hover
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
 * @property {String} textAlign Alignment of the banner within the parent container
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
 * @property {Object} history Browser history API
 */
Banner.propTypes = {
    classes: shape({
        root: string,
        link: string,
        wrapper: string,
        overlay: string,
        content: string,
        button: string,
        buttonHover: string,
        posterOverlay: string,
        posterOverlayHover: string,
        collageLeftOverlay: string,
        collageLeftOverlayHover: string,
        collageCenteredOverlay: string,
        collageCenteredOverlayHover: string,
        collageRightOverlay: string,
        collageRightOverlayHover: string
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
    openInNewTab: bool,
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
    cssClasses: arrayOf(string),
    history: object
};

export default withRouter(Banner);
