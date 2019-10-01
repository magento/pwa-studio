import React, { useMemo } from 'react';
import { string, shape, array } from 'prop-types';

import { mergeClasses } from '../../classify';
import GalleryItem from './item';
import defaultClasses from './gallery.css';

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Gallery = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { items } = props;

    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return <GalleryItem key={index} />;
                }
                return <GalleryItem key={index} item={mapGalleryItem(item)} />;
            }),
        [items]
    );

    return (
        <div className={classes.root}>
            <div className={classes.items}>{galleryItems}</div>
        </div>
    );
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    items: array.isRequired
};

export default Gallery;
