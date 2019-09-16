import React from 'react';
import { string, shape, array, number } from 'prop-types';

import { mergeClasses } from '../../classify';
import GalleryItems, { emptyData } from './items';
import defaultClasses from './gallery.css';

const Gallery = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { data, pageSize } = props;
    const hasData = Array.isArray(data) && data.length;
    const items = hasData ? data : emptyData;

    return (
        <div className={classes.root}>
            <div className={classes.items}>
                <GalleryItems items={items} pageSize={pageSize} />
            </div>
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
    data: array,
    pageSize: number
};

Gallery.defaultProps = {
    data: emptyData
};

export default Gallery;
