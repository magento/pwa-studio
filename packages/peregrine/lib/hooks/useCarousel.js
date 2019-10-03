import { useCallback, useMemo, useState } from 'react';

const sortImages = (images = []) =>
    images
        .filter(({ disabled }) => !disabled)
        .sort((a, b) => a.position - b.position);

/**
 * A hook for interacting with the state of a carousel of images.
 *
 * @param {Array} images an array of image objects
 * @param {number} startIndex the index at which to start the carousel
 */
export const useCarousel = (images = [], startIndex = 0) => {
    const [activeItemIndex, setActiveItemIndex] = useState(startIndex);

    const sortedImages = useMemo(() => sortImages(images), [images]);

    const handlePrevious = useCallback(() => {
        if (activeItemIndex > 0) {
            setActiveItemIndex(activeItemIndex - 1);
        } else {
            setActiveItemIndex(images.length - 1);
        }
    }, [activeItemIndex, images]);

    const handleNext = useCallback(() => {
        setActiveItemIndex((activeItemIndex + 1) % images.length);
    }, [activeItemIndex, images]);

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
