import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import ResponsiveImage from 'src/components/ResponsiveImage';
import { transparentPlaceholder } from 'src/shared/images';

class Carousel extends Component {
    static propTypes = {
        classes: PropTypes.objectOf(PropTypes.string),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                position: PropTypes.number,
                disabled: PropTypes.bool,
                file: PropTypes.string.isRequired
            })
        ).isRequired
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

    render() {
        const { classes, images } = this.props;

        const sortedImages = this.sortAndFilterImages(images);

        const { label, file } = sortedImages[0] || {};
        const alt = label || 'product';
        const mainImage = file ? (
            <ResponsiveImage
                className={classes.currentImage}
                alt={alt}
                src={file}
                sizes="(max-width: 640px) 100vw, (min-width: 640px 80vw)"
                widthOptions={[320, 640]}
                type="product"
            />
        ) : (
            <img
                className={classes.currentImage}
                src={transparentPlaceholder}
                alt={alt}
            />
        );
        return (
            <div className={classes.root}>
                {mainImage}
                <ThumbnailList getItemKey={i => i.file} items={sortedImages} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
