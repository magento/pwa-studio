import { useCallback, useState, useMemo } from 'react';
import { useSortedImages } from './useSortedImages';

/**
 * A hook for interacting with the state of a carousel of images.
 *
 * @param {Array} images an array of image objects
 * @param {number} startIndex the index at which to start the carousel
 */
export const useCarousel = (images, startIndex = 0) => {
    const sortedImages = useSortedImages(images);
    const [activeItemIndex, setActiveItemIndex] = useState(startIndex);

    const handlePrevious = useCallback(
        () =>
            activeItemIndex > 0
                ? setActiveItemIndex(activeItemIndex - 1)
                : setActiveItemIndex(images.length - 1),
        [activeItemIndex, images.length]
    );

    const handleNext = useCallback(
        () => setActiveItemIndex((activeItemIndex + 1) % images.length),
        [activeItemIndex, images.length]
    );

    const api = useMemo(
        () => ({ handlePrevious, handleNext, setActiveItemIndex }),
        [handlePrevious, handleNext, setActiveItemIndex]
    );

    const state = {
        activeItemIndex,
        sortedImages
    };

    return [state, api];
};
