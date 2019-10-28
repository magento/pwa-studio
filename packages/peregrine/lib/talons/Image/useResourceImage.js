import { useMemo } from 'react';

/**
 * 
 * @param {*} props         generateSrcset,
        resource,
        resourceHeight,
        resourceSizeBreakpoints,
        resourceSizes,
        resourceUrl,
        resourceWidth,
        type
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

    // Example: 5rem
    // Example: (max-width: 640px) 2rem, 5rem
    const sizes = useMemo(() => {
        // Helper function for prepending sizes media constraints.
        const constrain = sizeName =>
            `(max-width: ${resourceSizeBreakpoints[sizeName]}) ${
                resourceSizes[sizeName]
            }`;

        // Note: it is assumed sizes will be filled from small, to medium, to large.
        // In other words, having values for small and large but not medium is not supported.
        const numBreakpoints = Object.keys(resourceSizeBreakpoints).length;
        switch (numBreakpoints) {
            case 2:
                return `${constrain('small')}, ${constrain('medium')}, ${
                    resourceSizes.large
                }`;
            case 1:
                return `${constrain('small')}, ${resourceSizes.medium}`;
            case 0:
            default:
                return resourceSizes.small;
        }
    }, [resourceSizeBreakpoints, resourceSizes]);

    return {
        sizes,
        src,
        srcSet
    };
};
