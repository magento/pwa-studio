import { useCallback, useMemo, useState } from 'react';

const imageCustomStyleProperties = {
    small: '--image-size-small',
    medium: '--image-size-medium',
    large: '--image-size-large'
};

/**
 * Returns props to render an Image component.
 *
 * @param {function} props.onError callback for error of loading image
 * @param {function} props.onLoad callback for load of image
 * @param {string} placeholder - data uri for placeholder image
 */
export const useImage = props => {
    const { onError, onLoad, resourceSizes } = props;
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

    // Example: { '--image-size-small': '5rem' }
    const customStyleProperties = useMemo(() => {
        const result = {};

        if (!resourceSizes) {
            return result;
        }

        for (const size in resourceSizes) {
            const styleKey = imageCustomStyleProperties[size];
            const value = resourceSizes[size];

            result[styleKey] = value;
        }

        return result;
    }, [resourceSizes]);

    return {
        customStyleProperties,
        handleError,
        handleImageLoad,
        hasError,
        isLoaded
    };
};
