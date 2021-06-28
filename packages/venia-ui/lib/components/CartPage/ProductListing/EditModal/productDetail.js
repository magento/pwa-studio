import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../../classify';
import Image from '../../../Image';
import defaultClasses from './productDetail.css';

const IMAGE_SIZE = 240;

const ProductDetail = props => {
    const { item, variantPrice } = props;
    const { formatMessage } = useIntl();
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
    const stockStatusLabels = new Map([
        [
            'IN_STOCK',
            formatMessage({
                id: 'productDetail.inStock',
                defaultMessage: 'In stock'
            })
        ],
        [
            'OUT_OF_STOCK',
            formatMessage({
                id: 'productDetail.outOfStock',
                defaultMessage: 'Out of stock'
            })
        ]
    ]);
    const stockStatus =
        stockStatusLabels.get(stockStatusValue) ||
        formatMessage({
            id: 'productDetail.unknown',
            defaultMessage: 'Unknown'
        });
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Image
                alt={name}
                classes={{
                    image: classes.image,
                    root: classes.imageContainer
                }}
                width={IMAGE_SIZE}
                resource={imageURL}
            />
            <span className={classes.productName}>{name}</span>
            <div className={classes.stockRow}>
                <span>
                    <FormattedMessage
                        id={'productDetail.skuNumber'}
                        defaultMessage={'SKU #'}
                        values={{ sku }}
                    />
                </span>
                <span>{stockStatus}</span>
            </div>
            <div className={classes.price}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
        </div>
    );
};

export default ProductDetail;
