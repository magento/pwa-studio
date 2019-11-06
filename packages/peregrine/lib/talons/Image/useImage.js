import { useCallback, useMemo, useState } from 'react';

/**
 * Returns props to render an Image component.
 *
 * @param {function} props.onError callback for error of loading image
 * @param {function} props.onLoad callback for load of image
 * @param {string}   props.unconstrainedSizeKey the key in props.widths for the unconstrained / default width.
 * @param {Map}      props.widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 */
export const useImage = props => {
    const { onError, onLoad, unconstrainedSizeKey, widths } = props;
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

    // Use the unconstrained / default entry in widths.
    const resourceWidth = useMemo(() => {
        if (!widths) {
            return undefined;
        }

        return widths.get(unconstrainedSizeKey);
    }, [unconstrainedSizeKey, widths]);

    return {
        handleError,
        handleImageLoad,
        hasError,
        isLoaded,
        resourceWidth
    };
};
