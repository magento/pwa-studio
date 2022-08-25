import React from 'react';
import defaultClasses from './image.module.css';
import { arrayOf, bool, oneOf, shape, string, number } from 'prop-types';
import { Link } from 'react-router-dom';
import resolveLinkProps from '@magento/peregrine/lib/util/resolveLinkProps';
import { useStyle } from '@magento/venia-ui/lib/classify';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

/**
 * Page Builder Image component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Image
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays an Image.
 */
const Image = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        desktopImage,
        mobileImage,
        altText,
        title,
        link,
        openInNewTab,
        caption,
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

    const figureStyles = {
        textAlign,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };
    const imageStyles = {
        border,
        borderColor,
        borderWidth,
        borderRadius
    };

    // Don't render anything if there is no image to be rendered
    if (!desktopImage && !mobileImage) {
        return null;
    }

    const MobileSourceFragment = mobileImage ? (
        <source
            media="(max-width: 48rem)"
            srcSet={resourceUrl(mobileImage.src, {
                type: 'image-wysiwyg',
                quality: 85
            })}
        />
    ) : (
        ''
    );

    const imgSrc = desktopImage
        ? resourceUrl(desktopImage.src, {
              type: 'image-wysiwyg',
              quality: 85
          })
        : '';

    const imgClassName =
        mobileImage && !desktopImage
            ? [classes.img, classes.mobileOnly].join(' ')
            : classes.img;

    const PictureFragment = (
        <>
            <picture>
                {MobileSourceFragment}
                <img
                    className={imgClassName}
                    srcSet={`${imgSrc} 1x`}
                    src={imgSrc}
                    title={title}
                    alt={altText}
                    style={imageStyles}
                    loading="lazy"
                />
            </picture>
            {caption ? <figcaption>{caption}</figcaption> : ''}
        </>
    );

    if (typeof link === 'string') {
        const linkProps = resolveLinkProps(link);
        const LinkComponent = linkProps.to ? Link : 'a';

        return (
            <figure
                data-cy="PageBuilder-Image-root"
                style={figureStyles}
                className={[classes.root, ...cssClasses].join(' ')}
            >
                <LinkComponent
                    {...linkProps}
                    {...(openInNewTab ? { target: '_blank' } : '')}
                >
                    {PictureFragment}
                </LinkComponent>
            </figure>
        );
    } else {
        return (
            <figure
                data-cy="PageBuilder-Image-root"
                style={figureStyles}
                className={[classes.root, ...cssClasses].join(' ')}
            >
                {PictureFragment}
            </figure>
        );
    }
};

/**
 * Props for {@link Image}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Image
 * @property {String} classes.img CSS classes for the img element
 * @property {Object} desktopImage desktop image URL src and dimensions
 * @property {Object} mobileImage mobile image URL src and dimensions
 * @property {String} altText Alternate text
 * @property {String} title Title of the image
 * @property {String} link URL to redirect to
 * @property {String} linkType Type of link
 * @property {bool} openInNewTab Flag to indicate if link should be opened in a new tab
 * @property {String} caption Caption for the image
 * @property {String} textAlign Alignment of the divider within the parent container
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
Image.propTypes = {
    classes: shape({
        root: string,
        img: string,
        mobileOnly: string
    }),
    desktopImage: shape({
        src: string,
        dimensions: shape({
            height: number,
            ratio: number,
            width: number
        })
    }),
    mobileImage: shape({
        src: string,
        dimensions: shape({
            height: number,
            ratio: number,
            width: number
        })
    }),
    altText: string,
    title: string,
    link: string,
    linkType: oneOf(['default', 'category', 'product', 'page']),
    openInNewTab: bool,
    caption: string,
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

export default Image;
