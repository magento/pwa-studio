import { useCallback, useEffect } from 'react';

import { useCarousel } from '@magento/peregrine';

import {
    sendMessageToSW,
    VALID_SERVICE_WORKER_ENVIRONMENT,
    isAbsoluteUrl
} from '@magento/venia-ui/lib/util/swUtils';
import { PREFETCH_IMAGES } from '@magento/venia-ui/lib/constants/swMessageTypes';
import { generateUrlFromContainerWidth } from '@magento/venia-ui/lib/util/images';

export const useProductImageCarousel = props => {
    const { images, type, imageWidth } = props;
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
        if (VALID_SERVICE_WORKER_ENVIRONMENT) {
            const urls = images.map(({ file }) => {
                let url = generateUrlFromContainerWidth(file, imageWidth, type);
                if (isAbsoluteUrl(url)) {
                    /**
                     * In case of `IMAGE_OPTIMIZING_ORIGIN` set to `backend`
                     * `venia-driver` returns full URL with backend URL set as
                     * origin, but SW does not accept that origin because of
                     * CORS rules. Origin should be same as the SW's origin
                     * which is `location.origin`.
                     */
                    const baseURL = new URL(url);
                    url = baseURL.href.slice(baseURL.origin.length);
                }
                return `${location.origin}${url}`;
            });
            sendMessageToSW(PREFETCH_IMAGES, {
                urls
            }).catch(err => {
                console.error(
                    'Unable to send PREFETCH_IMAGES message to SW',
                    err
                );
            });
        }
    }, [images, imageWidth, type]);

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
