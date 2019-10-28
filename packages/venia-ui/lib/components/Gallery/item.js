import React from 'react';
import { string, number, shape } from 'prop-types';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { Price } from '@magento/peregrine';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

import { mergeClasses } from '../../classify';
import Image from '../Image';
import defaultClasses from './item.css';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const imageWidth = '300';
const imageHeight = '375';

const IMAGE_SIZE_BREAKPOINTS = {
    small: '640px'
};
const IMAGE_SIZES = {
    small: '300px',
    medium: '840px'
};

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

const ItemPlaceholder = ({ classes }) => (
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
    </div>
);

const GalleryItem = props => {
    const { item } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!item) {
        return <ItemPlaceholder classes={classes} />;
    }

    const { name, price, small_image, url_key } = item;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix}`);

    return (
        <div className={classes.root}>
            <Link to={productLink} className={classes.images}>
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    resource={small_image}
                    resourceHeight={imageHeight}
                    resourceSizeBreakpoints={IMAGE_SIZE_BREAKPOINTS}
                    resourceSizes={IMAGE_SIZES}
                    resourceWidth={imageWidth}
                />
            </Link>
            <Link to={productLink} className={classes.name}>
                <span>{name}</span>
            </Link>
            <div className={classes.price}>
                <Price
                    value={price.regularPrice.amount.value}
                    currencyCode={price.regularPrice.amount.currency}
                />
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageContainer: string,
        imagePlaceholder: string,
        image_pending: string,
        images: string,
        images_pending: string,
        name: string,
        name_pending: string,
        price: string,
        price_pending: string,
        root: string,
        root_pending: string
    }),
    item: shape({
        id: number.isRequired,
        name: string.isRequired,
        small_image: string.isRequired,
        url_key: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    })
};

export default GalleryItem;
