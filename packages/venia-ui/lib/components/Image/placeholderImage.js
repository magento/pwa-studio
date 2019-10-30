import React from 'react';
import { bool, instanceOf, number, shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { usePlaceholderImage } from '@magento/peregrine/lib/talons/Image/usePlaceholderImage';

import SimpleImage from './simpleImage';

/**
 * A placeholder to use until the actual image is loaded.
 * This is used both for user experience and layout purposes.
 * Callers can disable the "user experience" part by setting displayPlaceholder to false.
 *
 * @param {string}   props.alt the alt attribute to apply to the image.
 * @param {object}   props.classes the pre-merged classes to apply to this component.
 * @param {bool}     props.displayPlaceholder whether or not to display a visual placeholder.
 * @param {string}   props.imageHasError there was an error loading the actual image.
 * @param {string}   props.imageIsLoaded the actual image is loaded.
 * @param {number}   props.resourceHeight the intrinsic height of the image.
 * @param {Map}      props.resourceSizes image sizes used by the browser to select the image source.
 *                                       Supported keys are 'small', 'medium', and 'large'.
 * @param {number}   props.resourceWidth the intrinsic width of the image.
 * @param {string}   props.src the actual src of the placeholder image.
 */
const PlaceholderImage = props => {
    const {
        alt,
        classes,
        displayPlaceholder,
        imageHasError,
        imageIsLoaded,
        resourceHeight,
        resourceSizes,
        resourceWidth,
        src,
        ...rest
    } = props;

    const talonProps = usePlaceholderImage({
        displayPlaceholder,
        imageHasError,
        imageIsLoaded,
        resourceSizes
    });

    const { shouldRenderPlaceholder } = talonProps;

    const placeholderClass = shouldRenderPlaceholder
        ? classes.placeholder
        : classes.placeholder_layoutOnly;

    const placeholderFullClass = `${classes.image} ${placeholderClass}`;

    // Note: Attributes that are allowed to be overridden must appear before the spread of `rest`.
    return (
        <SimpleImage
            loading="eager"
            height={resourceHeight}
            width={resourceWidth}
            {...rest}
            alt={alt}
            className={placeholderFullClass}
            src={src}
        />
    );
};

PlaceholderImage.propTypes = {
    alt: string.isRequired,
    classes: shape({
        image: string,
        placeholder: string,
        placeholder_layoutOnly: string
    }).isRequired,
    displayPlaceholder: bool,
    imageHasError: bool,
    imageIsLoaded: bool,
    resourceHeight: number,
    resourceSizes: instanceOf(Map),
    resourceWidth: number,
    src: string
};

PlaceholderImage.defaultProps = {
    src: transparentPlaceholder
};

export default PlaceholderImage;
