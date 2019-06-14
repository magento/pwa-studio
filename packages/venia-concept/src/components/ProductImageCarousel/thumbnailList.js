import React, { useCallback } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Thumbnail from './thumbnail';
import defaultClasses from './thumbnailList.css';

const ThumbnailList = props => {
    const { activeItemIndex, items, onItemClick } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const handleThumbnailClick = useCallback(
        index => {
            onItemClick(index);
        },
        [onItemClick]
    );

    const thumbnails = items.map((item, index) => (
        <Thumbnail
            key={index}
            item={item}
            itemIndex={index}
            isActive={activeItemIndex === index}
            onClickHandler={handleThumbnailClick}
        />
    ));

    return <div className={classes.root}>{thumbnails}</div>;
};

ThumbnailList.propTypes = {
    activeItemIndex: number,
    classes: shape({
        root: string
    }),
    items: arrayOf(
        shape({
            label: string,
            position: number,
            disabled: bool,
            file: string.isRequired
        })
    ).isRequired,
    onItemClick: func.isRequired
};

export default ThumbnailList;
