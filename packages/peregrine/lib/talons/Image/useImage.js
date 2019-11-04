import { useCallback, useMemo, useState } from 'react';

/**
 * Returns props to render an Image component.
 *
 * @param {function} props.onError callback for error of loading image
 * @param {function} props.onLoad callback for load of image
 * @param {Map}      props.resourceSizes image sizes used by the browser to select the image source. Supported keys are 'small', 'medium', and 'large'.
 * @param {number}   props.resourceWidth the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 */
export const useImage = props => {
    const {
        onError,
        onLoad,
        resourceSizes,
        resourceWidth: propResourceWidth
    } = props;
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleImageLoad = useCallback(() => {
        setIsLoaded(true);

        if (typeof onLoad === 'function') {
            onLoad();
        }
    }, [onLoad]);

    const handleError = useCallback(() => {
        setHasError(true);

        if (typeof onError === 'function') {
            onError();
        }
    }, [onError]);

    // If we don't have a resourceWidth, use the smallest resource size.
    const resourceWidth = useMemo(() => {
        if (propResourceWidth) {
            return propResourceWidth;
        }

        if (!resourceSizes) {
            return null;
        }

        return resourceSizes.get('small') || null;
    }, [propResourceWidth, resourceSizes]);

    return {
        handleError,
        handleImageLoad,
        hasError,
        isLoaded,
        resourceWidth
    };
};
