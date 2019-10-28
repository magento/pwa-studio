import { useMemo } from 'react';

const imageCustomCSSProperties = {
    small: '--image-size-small',
    medium: '--image-size-medium',
    large: '--image-size-large'
};

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
    }, [resource, resourceHeight, resourceWidth, type]);
    
    const srcSet = useMemo(() => generateSrcset(resource, type), [
        resource,
        type
    ]);
    
    // Example: 5rem
    // Example: (max-width: 640px) 2rem, 5rem
    const sizes = useMemo(() => {
        // Helper function for prepending sizes media constraints.
        const constrain = sizeName => `(max-width: ${resourceSizeBreakpoints[sizeName]}) ${resourceSizes[sizeName]}`;
        
        const numBreakpoints = Object.keys(resourceSizeBreakpoints).length;
        switch(numBreakpoints) {
            case 2: return `${constrain('small')}, ${constrain('medium')}, ${resourceSizes.large}`;
            case 1: return `${constrain('small')}, ${resourceSizes.medium}`;
            case 0:
            default:
                return resourceSizes.small;
        }
    }, [resourceSizeBreakpoints, resourceSizes]);

    // Example: { '--venia-swatch-bg': randomColor }
    const customCSSProperties = useMemo(() => {
        const result = {};

        for (const size in resourceSizes) {
            const styleKey = imageCustomCSSProperties[size];
            const value = resourceSizes[size];

            result[styleKey] = value;
        }

        return result;
    }, [resourceSizes]);

    return {
        customCSSProperties,
        sizes,
        src,
        srcSet
    };
};
