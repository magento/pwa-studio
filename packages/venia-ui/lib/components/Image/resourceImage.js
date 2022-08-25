import React from 'react';
import { func, instanceOf, number, oneOfType, string } from 'prop-types';
import { useResourceImage } from '@magento/peregrine/lib/talons/Image/useResourceImage';
import {
    generateSrcset,
    generateUrl
} from '@magento/peregrine/lib/util/imageUtils';

/**
 * Renders a Magento resource image.
 *
 * @param {string}   props.alt the alt attribute to apply to the image.
 * @param {string}   props.className the class to apply to this image.
 * @param {Func}     props.handleError the function to call if the image fails to load.
 * @param {Func}     props.handleLoad the function to call if the image successfully loads.
 * @param {number}   props.height the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}   props.width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {Map}      props.widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 * @param {number}   props.ratio is the image width to height ratio. Defaults to 4/5.
 */
const ResourceImage = props => {
    const {
        alt,
        className,
        handleError,
        handleLoad,
        height,
        resource,
        type,
        width,
        widths,
        ratio,
        ...rest
    } = props;

    const talonProps = useResourceImage({
        generateSrcset,
        generateUrl,
        height,
        resource,
        type,
        width,
        widths,
        ratio
    });

    const { sizes, src, srcSet } = talonProps;
    const dimensionAttributes = {};
    if (typeof height !== 'undefined') {
        dimensionAttributes['--height'] = height + 'px';
    }
    if (typeof width !== 'undefined') {
        dimensionAttributes['--width'] = width + 'px';
    }
    // Note: Attributes that are allowed to be overridden must appear before the spread of `rest`.
    return (
        <img
            loading="lazy"
            style={dimensionAttributes}
            {...rest}
            alt={alt}
            className={className}
            onError={handleError}
            onLoad={handleLoad}
            sizes={sizes}
            src={src}
            srcSet={srcSet}
            width={width}
        />
    );
};

ResourceImage.propTypes = {
    alt: string.isRequired,
    className: string,
    handleError: func,
    handleLoad: func,
    resource: string.isRequired,
    height: oneOfType([number, string]),
    type: string,
    width: oneOfType([number, string]),
    widths: instanceOf(Map)
};

ResourceImage.defaultProps = {
    type: 'image-product'
};

export default ResourceImage;
