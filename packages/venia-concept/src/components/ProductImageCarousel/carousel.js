import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { resourceUrl } from 'src/drivers';
import Icon from 'src/components/Icon';
import ChevronLeftIcon from 'react-feather/dist/icons/chevron-left';
import ChevronRightIcon from 'react-feather/dist/icons/chevron-right';
import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { transparentPlaceholder } from 'src/shared/images';

const ChevronIcons = {
    left: ChevronLeftIcon,
    right: ChevronRightIcon
};

class Carousel extends Component {
    static propTypes = {
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

    state = {
        activeItemIndex: 0,
        currentImageLoaded: false
    };

    updateActiveItemIndex = index => {
        this.setState({ activeItemIndex: index });
    };

    // The spec does not guarantee a position parameter,
    // so the rule will be to order items without position last.
    // See https://github.com/magento/graphql-ce/issues/113.
    // Memoize this expensive operation based on reference equality
    // of the `images` array. Apollo cache should return a new array
    // only when it does a new fetch.
    sortAndFilterImages = memoize(items =>
        items
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            })
    );

    get sortedImages() {
        const { images } = this.props;
        return this.sortAndFilterImages(images);
    }

    leftChevronHandler = () => {
        const sortedImages = this.sortedImages;
        const { activeItemIndex } = this.state;
        activeItemIndex > 0
            ? this.updateActiveItemIndex(activeItemIndex - 1)
            : this.updateActiveItemIndex(sortedImages.length - 1);
    };

    rightChevronHandler = () => {
        const sortedImages = this.sortedImages;
        const { activeItemIndex } = this.state;
        this.updateActiveItemIndex((activeItemIndex + 1) % sortedImages.length);
    };

    getChevron = direction => (
        <button
            onClick={this[`${direction}ChevronHandler`]}
            className={this.props.classes[`chevron-${direction}`]}
        >
            <Icon src={ChevronIcons[direction]} size={40} />
        </button>
    );

    setCurrentImageLoaded = () => {
        this.setState({
            currentImageLoaded: true
        });
    };

    render() {
        const { classes } = this.props;

        const sortedImages = this.sortedImages;

        const mainImage = sortedImages[this.state.activeItemIndex] || {};
        const src = mainImage.file
            ? resourceUrl(mainImage.file, { type: 'image-product', width: 640 })
            : transparentPlaceholder;
        const alt = mainImage.label || 'image-product';
        return (
            <div className={classes.root}>
                <div className={classes.imageContainer}>
                    {this.getChevron('left')}
                    <img
                        onLoad={this.setCurrentImageLoaded}
                        className={classes.currentImage}
                        src={src}
                        alt={alt}
                    />
                    {!this.state.currentImageLoaded ? (
                        <img
                            className={classes.currentImage}
                            src={transparentPlaceholder}
                            alt={alt}
                        />
                    ) : null}
                    {this.getChevron('right')}
                </div>
                <ThumbnailList
                    items={sortedImages}
                    activeItemIndex={this.state.activeItemIndex}
                    updateActiveItemIndex={this.updateActiveItemIndex}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
