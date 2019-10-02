import { useCallback, useState } from 'react';

/**
 * Returns props to render an Image component.
 *
 * @param {function} props.onError callback for error of loading image
 * @param {function} props.onLoad callback for load of image
 * @param {string} placeholder - data uri for placeholder image
 */
export const useImage = props => {
    const { onError, onLoad, placeholder } = props;
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

    return {
        handleError,
        handleImageLoad,
        hasError,
        isLoaded,
        shouldRenderPlaceholder: !!placeholder && !isLoaded
    };
};
