import React, { useMemo } from 'react';
import { arrayOf, object, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import Image from '../Image';

import defaultClasses from './collapsedImageGallery.module.css';

const DISPLAY_COUNT = 4;

const CollapsedImageGallery = props => {
    const { items } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const remainderCount = items.length - DISPLAY_COUNT;

    const imageElements = useMemo(() => {
        if (items) {
            const baseImageElements = Object.values(items)
                .slice(0, DISPLAY_COUNT)
                .map((item, index) => {
                    const { thumbnail, name } = item;
                    const { url } = thumbnail;

                    return (
                        <Image
                            key={Object.keys(items)[index]}
                            alt={name}
                            src={url}
                            width={48}
                        />
                    );
                });

            // If the order contains more than four products, render a remainder count in the last column.
            if (remainderCount > 0) {
                const remainderCountString = `+${remainderCount}`;
                baseImageElements.push(
                    <span
                        key={'remainder-column'}
                        className={classes.remainderCount}
                    >
                        {remainderCountString}
                    </span>
                );
            }

            return baseImageElements;
        }
    }, [classes.remainderCount, items, remainderCount]);

    return <div className={classes.root}>{imageElements}</div>;
};

export default CollapsedImageGallery;

CollapsedImageGallery.propTypes = {
    classes: shape({
        root: string,
        remainderCount: string
    }),
    items: arrayOf(object)
};
