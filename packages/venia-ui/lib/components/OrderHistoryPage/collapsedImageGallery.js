import React, { useMemo } from 'react';
import { useCollapsedImageGallery } from '@magento/peregrine/lib/talons/OrderHistoryPage/useCollapsedImageGallery';

import { mergeClasses } from '../../classify';
import defaultClasses from './collapsedImageGallery.css';
import imageGalleryOperations from './collapsedImageGallery.gql';
import Image from '../Image';
import { arrayOf, object, shape, string } from 'prop-types';

const DISPLAY_COUNT = 4;

const CollapsedImageGallery = props => {
    const { items } = props;

    const talonProps = useCollapsedImageGallery({
        imageCount: DISPLAY_COUNT,
        items,
        ...imageGalleryOperations
    });
    const { imageData } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const remainderCount = items.length - DISPLAY_COUNT;

    const imageElements = useMemo(() => {
        if (imageData) {
            const { products } = imageData;
            const { items } = products;

            const baseImageElements = items.map(item => {
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
    }, [classes.remainderCount, imageData, remainderCount]);

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
