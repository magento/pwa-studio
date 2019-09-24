import React from 'react';
import defaultClasses from './row.css';
import { verticalAlignmentToFlex } from '../../utils';
import { Parallax } from 'react-parallax';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, oneOf, shape, bool, string, number } from 'prop-types';
import { resourceUrl } from '@magento/venia-drivers';

const Row = props => {
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
        parallaxSpeed,
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
        paddingLeft
    };

    if (!enableParallax && image) {
        dynamicStyles.backgroundImage = image
            ? `url(${resourceUrl(image, { type: 'image-wysiwyg' })})`
            : null;
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

    if (enableParallax) {
        return (
            <Parallax
                strength={parallaxSpeed * 200}
                bgImage={image}
                style={dynamicStyles}
                className={cssClasses.join(' ')}
            >
                {children}
            </Parallax>
        );
    }

    return (
        <div style={dynamicStyles} className={cssClasses.join(' ')}>
            {children}
        </div>
    );
};

Row.propTypes = {
    classes: shape({
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
    cssClasses: arrayOf(string)
};

export default Row;
