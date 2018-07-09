import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
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
        items.filter(i => !i.disabled).sort((a, b) => {
            const aPos = isNaN(a.position) ? 9999 : a.position;
            const bPos = isNaN(b.position) ? 9999 : b.position;
            return bPos - aPos;
        })
    );

    render() {
        const { classes, images } = this.props;

        const sortedImages = this.sortAndFilterImages(images);

        const mainImage = sortedImages[0] || {};
        const src = mainImage.file
            ? makeProductMediaPath(mainImage.file)
            : transparentPlaceholder;
        const alt = mainImage.label || 'product';
        return (
            <div className={classes.root}>
                <img className={classes.currentImage} src={src} alt={alt} />
                <ThumbnailList getItemKey={i => i.file} items={sortedImages} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
