import { useCallback, useEffect } from 'react';

import { useCarousel } from '@magento/peregrine';

import { sendMessageToSW } from '@magento/venia-ui/lib/util/swUtils';
import { PREFETCH_IMAGES } from '@magento/venia-ui/lib/constants/swMessageTypes';
import { generateUrlFromContainerWidth } from '@magento/venia-ui/lib/util/images';

export const useProductImageCarousel = props => {
    const { images, type, containerWidth } = props;
    const [carouselState, carouselApi] = useCarousel(images);
    const { activeItemIndex, sortedImages } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;

    const handleThumbnailClick = useCallback(
        index => {
            setActiveItemIndex(index);
        },
        [setActiveItemIndex]
    );

    // Whenever the incoming images changes reset the active item to the first.
    useEffect(() => {
        setActiveItemIndex(0);
    }, [images, setActiveItemIndex]);

    useEffect(() => {
        const urls = images.map(
            ({ file }) =>
                `${location.origin}${generateUrlFromContainerWidth(
                    file,
                    containerWidth,
                    type
                )}`
        );
        sendMessageToSW(PREFETCH_IMAGES, {
            urls
        }).catch(err => {
            console.error('Unable to send PREFETCH_IMAGES message to SW', err);
        });
    }, [images, containerWidth, type]);

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
