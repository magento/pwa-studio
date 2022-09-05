import React, { useMemo } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ChevronUp as ChevronUpIcon,
    ChevronDown as ChevronDownIcon
} from 'react-feather';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useProductImageCarousel } from '@magento/peregrine/lib/talons/ProductImageCarousel/useProductImageCarousel';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AriaButton from '@magento/venia-ui/lib/components/AriaButton';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from '@magento/venia-ui/lib/components/ProductImageCarousel/carousel.module.css';
import Thumbnail from '@magento/venia-ui/lib/components/ProductImageCarousel/thumbnail';
import ReactImageZoom from 'react-image-zoom';
import { generateUrl } from '@magento/peregrine/lib/util/imageUtils';
const IMAGE_WIDTH = 640;

/**
 * Carousel component for product images
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 *
 * @typedef ProductImageCarousel
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element}
 */
const ProductImageCarousel = props => {
    const { images, carouselWidth } = props;

    const { formatMessage } = useIntl();
    const talonProps = useProductImageCarousel({
        images,
        imageWidth: IMAGE_WIDTH
    });

    const {
        currentImage,
        activeItemIndex,
        altText,
        handleNext,
        handlePrevious,
        handleThumbnailClick,
        sortedImages,
        initialIndex,
        lastIndex
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const thumbnails = useMemo(() => {
        return sortedImages.map((item, index) => {
            return index >= initialIndex && index <= lastIndex ? (
                <Thumbnail
                    key={item.uid}
                    item={item}
                    itemIndex={index}
                    isActive={activeItemIndex === index}
                    onClickHandler={handleThumbnailClick}
                    carouselWidth={carouselWidth}
                />
            ) : null;
        });
    }, [activeItemIndex, handleThumbnailClick, sortedImages, initialIndex, lastIndex]);

    const src = useMemo(() => {
        if (currentImage.file) {
            return generateUrl(currentImage.file, 'image-product')(IMAGE_WIDTH, 800);
        }
    }, [generateUrl, currentImage, IMAGE_WIDTH]);
    let image;
    if (currentImage.file) {
        image = (
            <ReactImageZoom
                zoomWidth={500}
                img={src}
            />
        );
    } else {
        image = (
            <Image
                alt={altText}
                classes={{
                    image: classes.currentImage_placeholder,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        );
    }

    const previousButton = formatMessage({
        id: 'productImageCarousel.previousButtonAriaLabel',
        defaultMessage: 'Previous Image'
    });

    const nextButton = formatMessage({
        id: 'productImageCarousel.nextButtonAriaLabel',
        defaultMessage: 'Next Image'
    });

    const chevronClasses = { root: classes.chevron };

    return (
        <div className={classes.root}>
            <div className={classes.carouselContainer}>
                <AriaButton
                    className={classes.previousButton}
                    onPress={handlePrevious}
                    aria-label={previousButton}
                    type="button"
                >
                    <Icon classes={chevronClasses} src={ChevronLeftIcon} size={40} />
                </AriaButton>
                {image}
                <AriaButton className={classes.nextButton} onPress={handleNext} aria-label={nextButton} type="button">
                    <Icon classes={chevronClasses} src={ChevronRightIcon} size={40} />
                </AriaButton>
            </div>

            <div className={classes.thumbnailList}>
                <AriaButton
                    className={classes.previousButtonDesktop}
                    onPress={activeItemIndex === 0 ? null : handlePrevious}
                    aria-label={previousButton}
                    type="button"
                >
                    <Icon classes={chevronClasses} src={ChevronUpIcon} size={40} />
                </AriaButton>

                {thumbnails}
                <AriaButton
                    className={classes.nextButtonDesktop}
                    onPress={activeItemIndex >= sortedImages.length - 1 ? null : handleNext}
                    aria-label={nextButton}
                    type="button"
                >
                    <Icon classes={chevronClasses} src={ChevronDownIcon} size={40} />
                </AriaButton>
            </div>
        </div>
    );
};

/**
 * Props for {@link ProductImageCarousel}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * ProductImageCarousel component
 * @property {string} classes.currentImage classes for visible image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.nextButton classes for next button
 * @property {string} classes.previousButton classes for previous button
 * @property {string} classes.root classes for root container
 * @property {Object[]} images Product images input for Carousel
 * @property {bool} images[].disabled Is image disabled
 * @property {string} images[].file filePath of image
 * @property {string} images[].uid the id of the image
 * @property {string} images[].label label for image
 * @property {string} images[].position Position of image in Carousel
 */
ProductImageCarousel.propTypes = {
    classes: shape({
        carouselContainer: string,
        currentImage: string,
        currentImage_placeholder: string,
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
            file: string.isRequired,
            uid: string.isRequired
        })
    ).isRequired
};

export default ProductImageCarousel;
