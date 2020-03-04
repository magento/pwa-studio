import React from 'react';
import { Price } from '@magento/peregrine';
import { useProductDetail } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductDetail';

import { mergeClasses } from '../../../../classify';
import Image from '../../../Image';
import defaultClasses from './productDetail.css';

const IMAGE_SIZE = 240;

const ProductDetail = props => {
    const { item } = props;
    const talonProps = useProductDetail({ item });
    const {
        currency,
        name,
        imageURL,
        sku,
        stockStatus,
        unitPrice
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Image
                alt={name}
                classes={{ image: classes.image, root: classes.imageContainer }}
                width={IMAGE_SIZE}
                resource={imageURL}
            />
            <span className={classes.productName}>{name}</span>
            <div className={classes.stockRow}>
                <span>{`SKU # ${sku}`}</span>
                <span>{stockStatus}</span>
            </div>
            <div className={classes.price}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
        </div>
    );
};

export default ProductDetail;
