import React, { useCallback, useMemo } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { useCarousel } from '@magento/peregrine';
import { resourceUrl } from 'src/drivers';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from 'react-feather';
import { mergeClasses } from 'src/classify';
import Thumbnail from './thumbnail';
import defaultClasses from './carousel.css';
import { transparentPlaceholder } from 'src/shared/images';
import Icon from 'src/components/Icon';
import Image from 'src/components/Image';
import Button from 'src/components/Button';

const DEFAULT_IMAGE_WIDTH = 640;

const Carousel = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [carouselState, carouselApi] = useCarousel(props.images);
    const { activeItemIndex, sortedImages } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;

    const handleThumbnailClick = useCallback(
        index => {
            setActiveItemIndex(index);
        },
        [setActiveItemIndex]
    );

    const currentImage = sortedImages[activeItemIndex] || {};

    const src = currentImage.file
        ? resourceUrl(currentImage.file, {
              type: 'image-product',
              width: DEFAULT_IMAGE_WIDTH
          })
        : transparentPlaceholder;

    const alt = currentImage.label || 'image-product';

    const thumbnails = useMemo(
        () =>
            sortedImages.map((item, index) => (
                <Thumbnail
                    key={index}
                    item={item}
                    itemIndex={index}
                    isActive={activeItemIndex === index}
                    onClickHandler={handleThumbnailClick}
                />
            )),
        [activeItemIndex, handleThumbnailClick, sortedImages]
    );

    return (
        <div className={classes.root}>
            <div className={classes.imageContainer}>
                <Button
                    classes={{
                        root_normalPriority: classes.previousButton
                    }}
                    onClick={handlePrevious}
                >
                    <Icon src={ChevronLeftIcon} size={40} />
                </Button>
                <Image
                    classes={{ root: classes.currentImage }}
                    src={src}
                    alt={alt}
                    placeholder={transparentPlaceholder}
                />
                <Button
                    classes={{
                        root_normalPriority: classes.nextButton
                    }}
                    onClick={handleNext}
                >
                    <Icon src={ChevronRightIcon} size={40} />
                </Button>
            </div>
            <div className={classes.thumbnailList}>{thumbnails}</div>
        </div>
    );
};

Carousel.propTypes = {
    classes: shape({
        currentImage: string,
        imageContainer: string,
        nextButton: string,
        previousButton: string,
        root: string
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
