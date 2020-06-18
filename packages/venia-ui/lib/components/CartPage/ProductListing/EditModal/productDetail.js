import React from 'react';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../../classify';
import Image from '../../../Image';
import defaultClasses from './productDetail.css';

const IMAGE_SIZE = 240;

const stockStatusLabels = new Map([
    ['IN_STOCK', 'In stock'],
    ['OUT_OF_STOCK', 'Out of stock']
]);

const ProductDetail = props => {
    const { item, variantPrice } = props;
    const { prices, product } = item;
    const { price } = prices;
    const { currency, value: unitPrice } = variantPrice || price;
    const {
        name,
        sku,
        small_image: smallImage,
        stock_status: stockStatusValue
    } = product;
    const { url: imageURL } = smallImage;
    const stockStatus = stockStatusLabels.get(stockStatusValue) || 'Unknown';

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
