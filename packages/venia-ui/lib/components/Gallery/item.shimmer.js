import React from 'react';
import { shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { mergeClasses } from '../../classify';
import Shimmer from '../Shimmer';
import Image from '../Image';
import defaultClasses from './item.css';

const ItemShimmer = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root_pending}>
            <div className={classes.images_pending}>
                <Image
                    alt="Placeholder for gallery item image"
                    classes={{
                        image: classes.image_pending,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </div>
            <div className={classes.name_pending} />
            <div className={classes.price_pending} />
            <Shimmer height={24} width={24} />
        </div>
    );
};

ItemShimmer.defaultProps = {
    classes: {}
};

ItemShimmer.propTypes = {
    classes: shape({
        root_pending: string,
        images_pending: string,
        image_pending: string,
        imageContainer: string,
        name_pending: string,
        price_pending: string
    })
};

export default ItemShimmer;
