import React from 'react';
import { func, number, shape, string } from 'prop-types';
import { resourceUrl } from '@magento/venia-drivers';
import { useResourceImage } from '@magento/peregrine/lib/talons/Image/useResourceImage';

import { generateSrcset } from '../../util/images';

/**
 * Renders a Magento resource image.
 *
 * @param {string}   props.className the class to apply to this image.
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {number}   props.resourceHeight the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {object}   props.resourceSizeBreakpoints breakpoints related to resourceSizes.
 * @param {object}   props.resourceSizes image sizes used by the browser to select the image source.
 * @param {number}   props.resourceWidth the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 */
const ResourceImage = props => {
    const {
        className,
        handleError,
        handleLoad,
        resource,
        resourceHeight,
        resourceSizeBreakpoints,
        resourceSizes,
        resourceWidth,
        type,
        ...rest
    } = props;

    const talonProps = useResourceImage({
        generateSrcset,
        resource,
        resourceHeight,
        resourceSizeBreakpoints,
        resourceSizes,
        resourceUrl,
        resourceWidth,
        type
    });

    const { customCSSProperties, sizes, src, srcSet } = talonProps;

    // Note: Attributes that are allowed to be overridden must appear before the spread of `rest`.
    return (
        <img
            loading="lazy"
            {...rest}
            className={className}
            onError={handleError}
            onLoad={handleLoad}
            sizes={sizes}
            src={src}
            srcSet={srcSet}
            style={customCSSProperties}
        />
    );
};

ResourceImage.propTypes = {
    className: string,
    handleError: func,
    handleLoad: func,
    resource: string,
    resourceHeight: number,
    resourceSizeBreakpoints: shape({
        small: string,
        medium: string,
        large: string
    }),
    resourceSizes: shape({
        default: string,
        small: string,
        medium: string,
        large: string
    }),
    resourceWidth: number,
    type: string
};

ResourceImage.defaultProps = {
    type: 'image-product'
};

export default ResourceImage;
