import React, { useCallback } from 'react';
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
import Image from 'src/components/Image';

const ChevronIcons = {
    left: ChevronLeftIcon,
    right: ChevronRightIcon
};

const DEFAULT_IMAGE_WIDTH = 640;

const Chevron = ({ className, direction, onClick }) => {
    return (
        <button onClick={onClick} className={className}>
            <Icon src={ChevronIcons[direction]} size={40} />
        </button>
    );
};

const Carousel = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [carouselState, carouselApi] = useCarousel(props.images);
    const { activeItemIndex, currentImage, sortedImages } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;

    const handleLeftChevron = useCallback(() => {
        handlePrevious();
    }, [handlePrevious]);

    const handleRightChevron = useCallback(() => {
        handleNext();
    }, [handleNext]);

    const handleThumbnailClick = useCallback(index => {
        setActiveItemIndex(index);
    }, []);

    const src =
        currentImage && currentImage.file
            ? resourceUrl(currentImage.file, {
                  type: 'image-product',
                  width: DEFAULT_IMAGE_WIDTH
              })
            : transparentPlaceholder;

    const alt = (currentImage && currentImage.label) || 'image-product';

    return (
        <div className={classes.root}>
            <div className={classes.imageContainer}>
                <Chevron
                    direction={'left'}
                    className={classes.chevronLeft}
                    onClick={handleLeftChevron}
                />
                <Image
                    classes={{ root: classes.currentImage }}
                    src={src}
                    alt={alt}
                    placeholder={transparentPlaceholder}
                />
                <Chevron
                    direction={'right'}
                    className={classes.chevronRight}
                    onClick={handleRightChevron}
                />
            </div>
            <ThumbnailList
                items={sortedImages}
                activeItemIndex={activeItemIndex}
                onItemClick={handleThumbnailClick}
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
