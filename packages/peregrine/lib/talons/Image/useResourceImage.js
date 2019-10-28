import { useMemo } from 'react';

const imageCustomCSSProperties = {
    default: '--image-size-default',
    small: '--image-size-small',
    medium: '--image-size-medium',
    large: '--image-size-large'
};

// Example: (max-width: 640px) 2rem, 5rem
const generateSizes = (breakpoints, sizes) => {
    const hasBreakpoints = breakpoints && Object.keys(breakpoints).length > 0;

    if (!hasBreakpoints) {
        return sizes.default;
    }

    return '';
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

    const customCSSProperties = null;
    // const customCSSProperties = useMemo(() => {
    //     if (!resourceSizes) { return {}; }

    //     const result = {};

    //     for (const size in resourceSizes) {
    //         const styleKey = imageCustomCSSProperties[size];
    //         const value = resourceSizes[size];

    //         result[styleKey] = value;
    //     }

    //     console.log('result', result);
    //     return result;
    // }, [resourceSizes]);

    const srcSet = useMemo(() => generateSrcset(resource, type), [
        resource,
        type
    ]);
    const src = useMemo(() => {
        return resourceUrl(resource, {
            type,
            height: resourceHeight,
            width: resourceWidth
        });
    }, [resource, resourceHeight, resourceWidth, type]);

    const sizes = '';
    //const sizes = useMemo(() => generateSizes(resourceSizeBreakpoints, resourceSizes), [resourceSizeBreakpoints, resourceSizes]);

    return {
        customCSSProperties,
        sizes,
        src,
        srcSet
    };
};
