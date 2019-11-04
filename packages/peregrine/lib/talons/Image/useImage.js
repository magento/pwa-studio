import { useCallback, useMemo, useState } from 'react';

/**
 * Returns props to render an Image component.
 *
 * @param {function} props.onError callback for error of loading image
 * @param {function} props.onLoad callback for load of image
 * @param {array}    props.widths the possible widths this image can be, used by the browser to select an image src.
 */
export const useImage = props => {
    const { onError, onLoad, widths } = props;
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

    // Use the smallest entry in widths.
    const resourceWidth = useMemo(() => {
        if (!widths) {
            return undefined;
        }

        return widths[0];
    }, [widths]);

    return {
        handleError,
        handleImageLoad,
        hasError,
        isLoaded,
        resourceWidth
    };
};
