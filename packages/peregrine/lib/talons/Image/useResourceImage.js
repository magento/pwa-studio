import { useMemo } from 'react';

/**
 * The talon for working with ResourceImages.
 * Does all the work of generating src, srcSet, and sizes attributes.
 *
 * @param {func}    props.generateSrcset - A function that returns a srcSet.
 * @param {string}  props.resource - The Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {number}  props.resourceHeight - The height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {Map}     props.resourceSizeBreakpoints breakpoints related to resourceSizes. Supported keys are 'small' and 'medium'.
 * @param {Map}     props.resourceSizes image sizes used by the browser to select the image source. Supported keys are 'small', 'medium', and 'large'.
 * @param {func}    props.resourceUrl - A function that returns the full URL for the Magento resource.
 * @param {number}  props.resourceWidth - The width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}  props.type - The Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 */
export const useResourceImage = props => {
    const {
        generateSrcset,
        resource,
        resourceHeight,
        resourceSizeBreakpoints,
        resourceSizes,
        resourceUrl,
        resourceWidth,
        type
    } = props;

    const src = useMemo(() => {
        return resourceUrl(resource, {
            type,
            height: resourceHeight,
            width: resourceWidth
        });
    }, [resource, resourceHeight, resourceUrl, resourceWidth, type]);

    const srcSet = useMemo(() => {
        return generateSrcset(resource, type);
    }, [generateSrcset, resource, type]);

    // Example: 100px
    // Example: (max-width: 640px) 50px, 100px
    const sizes = useMemo(() => {
        // The values in resourceSizes are numbers. Convert to string by adding 'px'.
        const getPixelSize = sizeName => resourceSizes.get(sizeName) + 'px';

        // Helper function for prepending sizes media constraints.
        const constrain = sizeName => {
            const breakpoint = resourceSizeBreakpoints.get(sizeName) + 'px';
            const size = getPixelSize(sizeName);

            return `(max-width: ${breakpoint}) ${size}`;
        };

        // Note: it is assumed sizes will be filled from small, to medium, to large.
        // In other words, having values for small and large but not medium is not supported.
        switch (resourceSizeBreakpoints.size) {
            case 2: {
                const small = constrain('small');
                const medium = constrain('medium');
                const large = getPixelSize('large');

                return `${small}, ${medium}, ${large}`;
            }
            case 1: {
                const small = constrain('small');
                const medium = getPixelSize('medium');

                return `${small}, ${medium}`;
            }
            case 0:
            default:
                return getPixelSize('small');
        }
    }, [resourceSizeBreakpoints, resourceSizes]);

    return {
        sizes,
        src,
        srcSet
    };
};
