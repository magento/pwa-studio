import { useState, useCallback } from 'react';

export const useCarousel = carouselSize => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [currentImageLoaded, setCurrentImageLoaded] = useState(false);

    const handleImageLoad = () => setCurrentImageLoaded(true);

    const handlePrevious = useCallback(() =>
        activeItemIndex > 0
            ? setActiveItemIndex(activeItemIndex - 1)
            : setActiveItemIndex(carouselSize - 1)
    );

    const handleNext = useCallback(() =>
        setActiveItemIndex((activeItemIndex + 1) % carouselSize)
    );

    return {
        activeItemIndex,
        setActiveItemIndex,
        currentImageLoaded,
        setCurrentImageLoaded,
        handleImageLoad,
        handlePrevious,
        handleNext
    };
};
