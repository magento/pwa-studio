import { useCallback } from 'react';
import { useCarousel } from '@magento/peregrine';

export const useProductImageCarousel = props => {
    const { images } = props;
    const [carouselState, carouselApi] = useCarousel(images);
    const { activeItemIndex, sortedImages } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;

    const handleThumbnailClick = useCallback(
        index => {
            setActiveItemIndex(index);
        },
        [setActiveItemIndex]
    );

    const currentImage = sortedImages[activeItemIndex] || {};
    const altText = currentImage.label || 'image-product';

    return {
        currentImage,
        activeItemIndex,
        altText,
        handleNext,
        handlePrevious,
        handleThumbnailClick,
        sortedImages
    };
};
