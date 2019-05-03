import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCarousel, useImageSort } from '@magento/peregrine';

import { resourceUrl } from 'src/drivers';
import Icon from 'src/components/Icon';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from 'react-feather';
import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { transparentPlaceholder } from 'src/shared/images';

const ChevronIcons = {
    left: ChevronLeftIcon,
    right: ChevronRightIcon
};

const Carousel = ({ classes, images }) => {
    const { sortAndFilterImages } = useImageSort();
    const sortedImages = sortAndFilterImages(images);

    const {
        activeItemIndex,
        setActiveItemIndex,
        currentImageLoaded,
        handleImageLoad,
        handlePrevious,
        handleNext
    } = useCarousel(sortedImages.length);

    const mainImage = sortedImages[activeItemIndex] || {};
    const src = mainImage.file
        ? resourceUrl(mainImage.file, { type: 'image-product', width: 640 })
        : transparentPlaceholder;
    const alt = mainImage.label || 'image-product';

    const getChevron = useCallback(direction => {
        return (
            <button
                onClick={direction === 'left' ? handlePrevious : handleNext}
                className={classes[`chevron-${direction}`]}
            >
                <Icon src={ChevronIcons[direction]} size={40} />
            </button>
        );
    });

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
                {!currentImageLoaded && (
                    <img
                        className={classes.currentImage}
                        src={transparentPlaceholder}
                        alt={alt}
                    />
                )}
                {getChevron('right')}
            </div>
            <ThumbnailList
                items={sortedImages}
                activeItemIndex={activeItemIndex}
                updateActiveItemIndex={setActiveItemIndex}
            />
        </div>
    );
};

Carousel.propTypes = {
    classes: PropTypes.shape({
        root: PropTypes.string,
        currentImage: PropTypes.string,
        imageContainer: PropTypes.string,
        'chevron-left': PropTypes.string,
        'chevron-right': PropTypes.string
    }),
    images: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            position: PropTypes.number,
            disabled: PropTypes.bool,
            file: PropTypes.string.isRequired
        })
    ).isRequired
};

export default classify(defaultClasses)(Carousel);
