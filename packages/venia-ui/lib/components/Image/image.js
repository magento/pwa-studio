import React, { Fragment, useMemo } from 'react';
import PropTypes, { func, number, oneOfType, shape, string } from 'prop-types';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { resourceUrl } from '@magento/venia-drivers';

import { generateSrcset } from '../../util/images';
import { mergeClasses } from '../../classify';
import defaultClasses from './image.css';

/**
 * The Image component renders a placeholder until the image is loaded.
 *
 * @param {string}   props.alt the alt text for the image
 * @param {string}   props.classes any classes to apply to this component
 * @param {number}   props.height the desired height of the image
 * @param {function} props.onError callback for error loading image
 * @param {function} props.onLoad callback for when image loads successfully
 * @param {string}   props.placeholder the placeholder source to display while the image loads or if it errors on load
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {string}   props.sizes the desired sizes attribute of the image
 * @param {string}   props.src the source of the image, ready to use in an img element
 * @param {number}   props.width the desired width of the image
 */
const Image = props => {
    const {
        alt,
        classes: propsClasses,
        height,
        onError,
        onLoad,
        placeholder,
        resource,
        resourceHeight,
        resourceWidth,
        sizes,
        src,
        type,
        width,
        ...rest
    } = props;

    const placeholderSrc = useMemo(() => {
        return placeholder ? placeholder : transparentPlaceholder;
    }, [placeholder]);

    const talonProps = useImage({
        onError,
        onLoad,
        placeholder: placeholderSrc
    });

    const {
        handleError,
        handleImageLoad,
        isLoaded,
        shouldRenderPlaceholder
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propsClasses);

    // A placeholder to use until the image is loaded.
    const placeholderClass = shouldRenderPlaceholder ? classes.placeholder_visible : classes.placeholder_hidden;
    const placeholderImage = (
        <img
            alt={alt}
            className={placeholderClass}
            height={height}
            loading="eager"
            src={placeholderSrc}
            width={width}
            {...rest}
        />
    );

    /*
     * These don't live in the talon because they depend on @magento/venia-drivers.
     */
    const imageSrcset = useMemo(
        () => generateSrcset(resource, type || 'image-product'),
        [resource]
    );
    const source = useMemo(() => {
        // If we have a direct src, use it.
        // Otherwise, get a resourceUrl from the resource and use that.
        return src ? src : resourceUrl(resource, {
            type: type || 'image-product',
            height: resourceHeight,
            width: resourceWidth
        });
    }, [resourceHeight, type, src, resourceWidth]);

    const imageClass = classes.root + ' ' + (isLoaded ? classes.loaded : classes.notLoaded);
    const actualImage = (
        /*
         * Note: attributes that are allowed to be overridden
         * must appear before the spread of `rest`.
         */
        <img
            loading="lazy"
            {...rest}
            alt={alt}
            className={imageClass}
            height={height}
            onError={handleError}
            onLoad={handleImageLoad}
            src={source}
            srcSet={imageSrcset}
            sizes={sizes}
            width={width}
        />
    );

    return (
        <Fragment>
            {actualImage}
            {placeholderImage}
        </Fragment>
    );
};

const conditionallyRequiredString = (props, propName, componentName) => {
    // This component needs one of src or resource to be provided.
    if (!props.src && !props.resource) {
        return new Error(
            `Missing both 'src' and 'resource' props in ${componentName}. ${componentName} needs at least one of these to be provided.`
        );
    }

    return PropTypes.checkPropTypes({
        resource: string,
        src: string
    }, props, propName, componentName);
};

Image.propTypes = {
    alt: string,
    classes: shape({
        loaded: string,
        notLoaded: string,
        root: string
    }),
    height: oneOfType([number, string]),
    onError: func,
    onLoad: func,
    placeholder: string,
    resource: conditionallyRequiredString,
    resourceHeight: oneOfType([number, string]),
    resourceWidth: oneOfType([number, string]),
    sizes: string,
    src: conditionallyRequiredString,
    type: string,
    width: oneOfType([number, string])
};

export default Image;
