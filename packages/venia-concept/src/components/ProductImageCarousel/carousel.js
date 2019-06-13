import React, { useCallback, useState } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { useCarousel } from '@magento/peregrine';

import { resourceUrl } from 'src/drivers';
import Icon from 'src/components/Icon';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from 'react-feather';
import { mergeClasses } from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { transparentPlaceholder } from 'src/shared/images';

const ChevronIcons = {
    left: ChevronLeftIcon,
    right: ChevronRightIcon
};

const Carousel = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [carouselState, carouselApi] = useCarousel(props.images);

    const { activeItemIndex, currentImage, sortedImages } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;
    const [currentImageLoaded, setCurrentImageLoaded] = useState(false);

    const handleLeftChevron = useCallback(() => {
        setCurrentImageLoaded(false);
        handlePrevious();
    }, [handlePrevious]);

    const handleRightChevron = useCallback(() => {
        setCurrentImageLoaded(false);
        handleNext();
    }, [handleNext]);

    const handleThumbnailClick = useCallback(index => {
        setCurrentImageLoaded(false);
        setActiveItemIndex(index);
    });

    const src = currentImage.file
        ? resourceUrl(currentImage.file, { type: 'image-product', width: 640 })
        : transparentPlaceholder;

    const alt = currentImage.label || 'image-product';

    const getChevron = useCallback(
        direction => {
            return (
                <button
                    onClick={
                        direction === 'left'
                            ? handleLeftChevron
                            : handleRightChevron
                    }
                    className={classes[`chevron-${direction}`]}
                >
                    <Icon src={ChevronIcons[direction]} size={40} />
                </button>
            );
        },
        [handleLeftChevron, handleRightChevron]
    );

    const placeholderImage = !currentImageLoaded && (
        <img
            className={classes.currentImage}
            src={transparentPlaceholder}
            alt={alt}
        />
    );

    const handleImageLoad = useCallback(() => setCurrentImageLoaded(true));

    // TODO: Evaluate why the re-render is occurring.
    return (
        <div className={classes.root}>
            <div className={classes.imageContainer}>
                {getChevron('left')}
                <img
                    onLoad={handleImageLoad}
                    className={classes.currentImage}
                    src={src}
                    alt={alt}
                />
                {placeholderImage}
                {getChevron('right')}
            </div>
            <ThumbnailList
                items={sortedImages}
                activeItemIndex={activeItemIndex}
                updateActiveItemIndex={handleThumbnailClick}
            />
        </div>
    );
};

Carousel.propTypes = {
    classes: shape({
        root: string,
        currentImage: string,
        imageContainer: string,
        'chevron-left': string,
        'chevron-right': string
    }),
    images: arrayOf(
        shape({
            label: string,
            position: number,
            disabled: bool,
            file: string.isRequired
        })
    ).isRequired
};

export default Carousel;
