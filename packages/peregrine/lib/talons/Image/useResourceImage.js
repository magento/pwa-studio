import { useMemo } from 'react';

/**
 * The talon for working with ResourceImages.
 * Does all the work of generating src, srcSet, and sizes attributes.
 *
 * @param {func}    props.generateSrcset - A function that returns a srcSet.
 * @param {string}  props.resource - The Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {number}  props.resourceHeight - The height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {func}    props.resourceUrl - A function that returns the full URL for the Magento resource.
 * @param {string}  props.type - The Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}  props.width - The width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {array}   props.widthBreakpoints - The breakpoints related to widths.
 * @param {array}   props.widths - The image widths used by the browser to select the image source.
 */
export const useResourceImage = props => {
    const {
        generateSrcset,
        resource,
        resourceHeight,
        resourceUrl,
        type,
        width,
        widthBreakpoints,
        widths
    } = props;

    const src = useMemo(() => {
        return resourceUrl(resource, {
            type,
            height: resourceHeight,
            width: width
        });
    }, [resource, resourceHeight, resourceUrl, width, type]);

    const srcSet = useMemo(() => {
        return generateSrcset(resource, type);
    }, [generateSrcset, resource, type]);

    // Example: 100px
    // Example: (max-width: 640px) 50px, 100px
    const sizes = useMemo(() => {
        // The values in widths are numbers. Convert to string by adding 'px'.
        const getPixelSize = index => widths[index] + 'px';

        // Helper function for prepending sizes media constraints.
        const constrain = index => {
            const breakpoint = widthBreakpoints[index] + 'px';
            const size = getPixelSize(index);

            return `(max-width: ${breakpoint}) ${size}`;
        };

        // The number of breakpoints must be one less than the number of sizes.
        // The last size entry (the one without a matching breakpoint) is unconstrained.
        const numBreakpoints = widthBreakpoints.length;
        const unconstrainedSizeIndex = numBreakpoints;
        const unconstrainedSize = getPixelSize(unconstrainedSizeIndex);

        // There aren't any breakpoints, this size will always be used.
        if (numBreakpoints === 0) {
            return unconstrainedSize;
        }
        
        // We have some breakpoints. Constrain the sizes with their matching breakpoint.
        // Constrain every size except the last one.
        const widthsToConstrain = widths.slice(0, widths.length);
        const sizesArr = widthsToConstrain.reduce(
            (constrainedSizesArray, _, currentSizeIndex) => {                
                const currentConstraint = constrain(currentSizeIndex);
                constrainedSizesArray.push(currentConstraint);
                return constrainedSizesArray;
            },
            []
        );
        // And add the unconstrained size at the end.
        sizesArr.push(unconstrainedSize);
        
        return sizesArr.join(', ');
    }, [widthBreakpoints, widths]);

    return {
        sizes,
        src,
        srcSet
    };
};
