import React from 'react';
import { shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '../../classify';

import Shimmer from '../Shimmer';
import Image from '../Image';
import defaultClasses from './item.module.css';

const GalleryItemShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer key="product-image">
                <Image
                    alt="Placeholder for gallery item image"
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </Shimmer>
            <Shimmer width="100%" key="product-name" />
            <Shimmer width={3} key="product-price" />
            <Shimmer type="button" key="add-to-cart" />
        </div>
    );
};

GalleryItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default GalleryItemShimmer;
