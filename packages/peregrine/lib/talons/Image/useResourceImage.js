import { useMemo } from 'react';

/**
 * The talon for working with ResourceImages.
 * Does all the work of generating src, srcSet, and sizes attributes.
 *
 * @param {func}    props.generateSrcset - A function that returns a srcSet.
 * @param {number}  props.height - The height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}  props.resource - The Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {func}    props.resourceUrl - A function that returns the full URL for the Magento resource.
 * @param {string}  props.type - The Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {string}  props.unconstrainedSizeKey - The key in props.widths for the unconstrained / default width.
 * @param {number}  props.width - The width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {Map}     props.widths - The map of breakpoints to possible widths used to create the img's sizes attribute.
 */
export const useResourceImage = props => {
    const {
        generateSrcset,
        height,
        resource,
        resourceUrl,
        type,
        unconstrainedSizeKey,
        width,
        widths
    } = props;

    const src = useMemo(() => {
        return resourceUrl(resource, {
            type,
            height: height,
            width: width
        });
    }, [height, resource, resourceUrl, type, width]);

    const srcSet = useMemo(() => {
        return generateSrcset(resource, type);
    }, [generateSrcset, resource, type]);

    // Example: 100px
    // Example: (max-width: 640px) 50px, 100px
    const sizes = useMemo(() => {
        if (!widths) {
            return '';
        }

        const result = [];
        for (const [breakpoint, width] of widths) {
            if (breakpoint !== unconstrainedSizeKey) {
                result.push(`(max-width: ${breakpoint}px) ${width}px`);
            }
        }

        // Add the unconstrained size at the end.
        result.push(`${widths.get(unconstrainedSizeKey)}px`);

        return result.join(', ');
    }, [unconstrainedSizeKey, widths]);

    return {
        sizes,
        src,
        srcSet
    };
};
