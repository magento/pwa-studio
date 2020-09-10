import React, { useMemo } from 'react';
import { arrayOf, object, shape, string, number } from 'prop-types';

import { mergeClasses } from '../../classify';
import Image from '../Image';

import defaultClasses from './collapsedImageGallery.css';

const CollapsedImageGallery = props => {
    const { displayCount, items, totalItemsCount } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const remainderCount = totalItemsCount - displayCount;

    const imageElements = useMemo(() => {
        if (items) {
            const baseImageElements = items.slice(0, displayCount).map(item => {
                const { id, thumbnail } = item;
                const { label, url } = thumbnail;

                return <Image key={id} alt={label} src={url} width={48} />;
            });

            // If the order contains more than four products, render a remainder count in the last column.
            if (remainderCount > 0) {
                baseImageElements.push(
                    <span
                        key={'remainder-column'}
                        className={classes.remainderCount}
                    >{`+${remainderCount}`}</span>
                );
            }

            return baseImageElements;
        }
    }, [classes.remainderCount, displayCount, items, remainderCount]);

    return <div className={classes.root}>{imageElements}</div>;
};

export default CollapsedImageGallery;

CollapsedImageGallery.propTypes = {
    classes: shape({
        root: string,
        remainderCount: string
    }),
    displayCount: number,
    items: arrayOf(object),
    totalItemsCount: number
};
