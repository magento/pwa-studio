import React from 'react';
import { bool, shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { usePlaceholderImage } from '@magento/peregrine/lib/talons/Image/usePlaceholderImage';

import SimpleImage from './simpleImage';

/**
 * A placeholder to use until the actual image is loaded.
 * This is used both for user experience and layout purposes.
 * Callers can disable the "user experience" part by setting displayPlaceholder to false.
 *
 * @param {object}   props.classes the pre-merged classes to apply to this component.
 * @param {bool}     props.displayPlaceholder whether or not to display a visual placeholder.
 * @param {string}   props.imageHasError there was an error loading the actual image.
 * @param {string}   props.imageIsLoaded the actual image is loaded.
 * @param {string}   props.src the actual src of the placeholder image.
 */
const PlaceholderImage = props => {
    const {
        classes,
        displayPlaceholder,
        imageHasError,
        imageIsLoaded,
        src,
        ...rest
    } = props;

    const talonProps = usePlaceholderImage({
        displayPlaceholder,
        imageHasError,
        imageIsLoaded
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
            {...rest}
            className={placeholderFullClass}
            src={src}
        />
    );
};

PlaceholderImage.propTypes = {
    classes: shape({
        image: string,
        placeholder: string,
        placeholder_layoutOnly: string
    }).isRequired,
    imageHasError: bool,
    imageIsLoaded: bool,
    src: string
};

PlaceholderImage.defaultProps = {
    src: transparentPlaceholder
};

export default PlaceholderImage;
