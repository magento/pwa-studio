import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import { imageItemPropType } from './constants';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import { transparentPlaceholder } from 'src/shared/images';

const chevronAttrs = {
    width: 40
};

const chevronDirs = {
    left: 'left',
    right: 'right'
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
        images: PropTypes.arrayOf(imageItemPropType).isRequired
    };

    state = {
        activeItemIndex: 0
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
                return bPos - aPos;
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
            ? this.setState({ activeItemIndex: activeItemIndex - 1 })
            : this.setState({ activeItemIndex: sortedImages.length - 1 });
    };

    rightChevronHandler = () => {
        const sortedImages = this.sortedImages;
        const { activeItemIndex } = this.state;
        this.setState({
            activeItemIndex: (activeItemIndex + 1) % sortedImages.length
        });
    };

    getChevron = direction => (
        <button
            onClick={this[`${direction}ChevronHandler`]}
            className={this.props.classes[`chevron-${direction}`]}
        >
            <Icon name={`chevron-${direction}`} attrs={chevronAttrs} />
        </button>
    );

    render() {
        const { classes } = this.props;

        const sortedImages = this.sortedImages;

        const mainImage = sortedImages[this.state.activeItemIndex] || {};
        const src = mainImage.file
            ? makeProductMediaPath(mainImage.file)
            : transparentPlaceholder;
        const alt = mainImage.label || 'product';
        return (
            <div className={classes.root}>
                <div className={classes.imageContainer}>
                    {this.getChevron(chevronDirs.left)}
                    <img className={classes.currentImage} src={src} alt={alt} />
                    {this.getChevron(chevronDirs.right)}
                </div>
                <ThumbnailList
                    getItemKey={i => i.file}
                    items={sortedImages}
                    activeItemSrc={
                        sortedImages[this.state.activeItemIndex].file
                    }
                    updateActiveItemIndex={this.updateActiveItemIndex}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
