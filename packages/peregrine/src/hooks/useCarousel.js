import { useCallback, useState, useMemo } from 'react';
import { useSortedImages } from './useSortedImages';

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
        currentImage: sortedImages[activeItemIndex],
        sortedImages
    };

    return [state, api];
};
