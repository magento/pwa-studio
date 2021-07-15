import React from 'react';
import { shape, string, array, object } from 'prop-types';
import { mergeClasses } from '../../classify';
import ItemShimmer from './item.shimmer';
import defaultClasses from './gallery.css';

const GalleryShimmer = (props) => {
    const { items, itemProps } = props
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.items}>
                {items.map((item, index) => {
                    return <ItemShimmer key={`item_${index}`} {...itemProps} />;
                })}
            </div>
        </div>
    );
};

GalleryShimmer.defaultProps = {
    classes: {},
    items: [],
    itemProps: {}
};

GalleryShimmer.propTypes = {
    classes: shape({
        root: string,
        items: string
    }),
    items: array,
    itemProps: shape({
        classes: object
    })
};

export default GalleryShimmer;
