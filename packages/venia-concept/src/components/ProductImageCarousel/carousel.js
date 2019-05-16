import React, { useState } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { resourceUrl } from 'src/drivers';
import Icon from 'src/components/Icon';
import ChevronLeftIcon from 'react-feather/dist/icons/chevron-left';
import ChevronRightIcon from 'react-feather/dist/icons/chevron-right';
import classify from 'src/classify';
import ImageLazyLoader from 'src/components/ImageLazyLoader';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { transparentPlaceholder } from 'src/shared/images';

const Carousel = ({ classes, images }) => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);

    const updateActiveItemIndex = index => {
        setActiveItemIndex(index);
    };

    // The spec does not guarantee a position parameter,
    // so the rule will be to order items without position last.
    // See https://github.com/magento/graphql-ce/issues/113.
    // Memoize this expensive operation based on reference equality
    // of the `images` array. Apollo cache should return a new array
    // only when it does a new fetch.
    const sortAndFilterImages = memoize(items =>
        items
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            })
    );
    const sortedImages = sortAndFilterImages(images);

    const leftChevronHandler = () => {
        activeItemIndex > 0
            ? setActiveItemIndex(activeItemIndex - 1)
            : setActiveItemIndex(sortedImages.length - 1);
    };

    const rightChevronHandler = () => {
        setActiveItemIndex((activeItemIndex + 1) % sortedImages.length);
    };

    const mainImage = sortedImages[activeItemIndex] || {};
    const src = mainImage.file
        ? resourceUrl(mainImage.file, { type: 'image-product', width: 640 })
        : transparentPlaceholder;
    const alt = mainImage.label || 'image-product';

    return (
        <div className={classes.root}>
            <div className={classes.imageContainer}>
                <button
                    className={classes[`chevron-left`]}
                    onClick={leftChevronHandler}
                >
                    <Icon src={ChevronLeftIcon} size={40} />
                </button>
                <ImageLazyLoader
                    className={classes.currentImage}
                    src={src}
                    alt={alt}
                />
                <button
                    className={classes[`chevron-right`]}
                    onClick={rightChevronHandler}
                >
                    <Icon src={ChevronRightIcon} size={40} />
                </button>
            </div>
            <ThumbnailList
                items={sortedImages}
                activeItemIndex={activeItemIndex}
                updateActiveItemIndex={updateActiveItemIndex}
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
