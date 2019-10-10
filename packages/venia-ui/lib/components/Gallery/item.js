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

const ItemPlaceholder = ({ classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>
            <Image
                alt="Placeholder for gallery item image"
                classes={{ root: classes.image_pending }}
                height={imageHeight}
                src={transparentPlaceholder}
                width={imageWidth}
            />
        </div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

const GalleryItem = props => {
    const { item } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!item) {
        return <ItemPlaceholder classes={classes} />;
    }

    const { name, price, small_image, url_key } = item;
    const productLink = `/${url_key}${productUrlSuffix}`;

    return (
        <div className={classes.root}>
            <Link to={resourceUrl(productLink)} className={classes.images}>
                <Image
                    alt={name}
                    classes={{ root: classes.image }}
                    fileSrc={small_image}
                    height={imageHeight}
                    placeholder={transparentPlaceholder}
                    sizes={`${imageWidth}px`}
                    width={imageWidth}
                />
            </Link>
            <Link to={resourceUrl(productLink)} className={classes.name}>
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
