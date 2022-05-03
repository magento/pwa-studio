import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import { useStyle } from '../../../../classify';
import Image from '../../../Image';
import defaultClasses from './productDetail.module.css';

const IMAGE_SIZE = 240;

const ProductDetail = props => {
    const { item, variantPrice, configurableThumbnailSource } = props;
    const { formatMessage } = useIntl();
    const { prices, product } = item;
    const { price } = prices;
    const { currency, value: unitPrice } = variantPrice || price;
    const { name, sku, stock_status: stockStatusValue } = product;
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
    const configured_variant = configuredVariant(
        item.configurable_options,
        product
    );
    return (
        <div className={classes.root}>
            <Image
                alt={name}
                classes={{
                    image: classes.image,
                    root: classes.imageContainer
                }}
                width={IMAGE_SIZE}
                resource={
                    configurableThumbnailSource === 'itself' &&
                    configured_variant
                        ? configured_variant.small_image.url
                        : product.small_image.url
                }
            />
            <span className={classes.productName}>{name}</span>
            <div className={classes.stockRow}>
                <span>
                    <FormattedMessage
                        id={'productDetail.skuNumber'}
                        defaultMessage={'SKU # {sku}'}
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
