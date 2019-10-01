import React from 'react';
import { arrayOf, bool, oneOf, shape, string } from 'prop-types';

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
        minHeight: minHeight,
        backgroundColor: backgroundColor,
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
        backgroundImage: image ? `url(${image})` : null,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat: backgroundRepeat ? 'repeat' : 'no-repeat'
    };

    if (appearance === 'poster') {
        cssClasses.push(classes.poster);
    }

    let children = props.children;
    if (appearance === 'poster') {
        children = <div className={classes.poster}>{children}</div>;
    }

    return (
        <div style={dynamicStyles} className={cssClasses.join(' ')}>
            {children}
        </div>
    );
};

/**
 * Props for {@link Banner}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the banner
 * @property {String} classes.poster CSS class for the poster appearance element
 * @property {String} classes.root CSS class for the banner root element
 * @property {String} minHeight CSS minimum height property
 * @property {String} backgroundColor CSS background-color property
 * @property {String} desktopImage Background image URL to be displayed on desktop devices
 * @property {String} mobileImage Background image URL to be displayed on mobile devices
 * @property {String} backgroundSize CSS background-size property
 * @property {String} backgroundPosition CSS background-position property
 * @property {String} backgroundAttachment CSS background-attachment property
 * @property {Boolean} backgroundRepeat CSS background-repeat property
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
        appearance: string
    }),
    appearance: oneOf([
        'poster',
        'collage-left',
        'collage-center',
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
