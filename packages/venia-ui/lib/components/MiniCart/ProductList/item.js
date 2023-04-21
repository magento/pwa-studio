import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { string, number, shape, func, arrayOf, oneOf } from 'prop-types';
import { Trash2 as DeleteIcon } from 'react-feather';
import { Link } from 'react-router-dom';

import Price from '@magento/venia-ui/lib/components/Price';
import { useItem } from '@magento/peregrine/lib/talons/MiniCart/useItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import ProductOptions from '../../LegacyMiniCart/productOptions';
import Image from '../../Image';
import Icon from '../../Icon';
import { useStyle } from '../../../classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import defaultClasses from './item.module.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        uid,
        quantity,
        configurable_options,
        handleRemoveItem,
        prices,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix,
        totalQuantity
    } = props;

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const itemLink = useMemo(
        () => resourceUrl(`/${product.url_key}${storeUrlSuffix || ''}`),
        [product.url_key, storeUrlSuffix]
    );
    const stockStatusText =
        product.stock_status === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'productList.outOfStock',
                  defaultMessage: 'Out-of-stock'
              })
            : '';

    const { isDeleting, removeItem } = useItem({
        uid,
        handleRemoveItem
    });

    const rootClass = isDeleting ? classes.root_disabled : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);

    const minicartButtonDeleted = formatMessage({
        id: 'global.deletedButton',
        defaultMessage: 'Item Deleted'
    });
    const miniCartButton = formatMessage({
        id: 'global.deleteButton',
        defaultMessage: 'Delete'
    });
    const buttonStatus = isDeleting ? minicartButtonDeleted : miniCartButton;

    const announceCartCount =
        totalQuantity > 1
            ? 'There are ' + totalQuantity + ' items left in your cart'
            : 'There is only one item left in your cart';

    return (
        <div className={rootClass} data-cy="MiniCart-Item-root">
            <Link
                className={classes.thumbnailContainer}
                to={itemLink}
                onClick={closeMiniCart}
                data-cy="item-thumbnailContainer"
            >
                <Image
                    alt={product.name}
                    classes={{
                        root: classes.thumbnail
                    }}
                    width={100}
                    resource={
                        configurableThumbnailSource === 'itself' &&
                        configured_variant
                            ? configured_variant.thumbnail.url
                            : product.thumbnail.url
                    }
                    data-cy="Item-image"
                />
            </Link>
            <Link
                className={classes.name}
                to={itemLink}
                onClick={closeMiniCart}
                data-cy="item-name"
            >
                {product.name}
            </Link>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span data-cy="MiniCart-Item-quantity" className={classes.quantity}>
                <FormattedMessage
                    id={'productList.quantity'}
                    defaultMessage={'Qty : {quantity}'}
                    values={{ quantity }}
                />
            </span>
            <span data-cy="MiniCart-Item-price" className={classes.price}>
                <Price
                    currencyCode={prices.price.currency}
                    value={prices.price.value}
                />
                <FormattedMessage
                    id={'productList.each'}
                    defaultMessage={' ea.'}
                />
            </span>
            <span className={classes.stockStatus}>{stockStatusText}</span>
            <button
                onClick={removeItem}
                type="button"
                className={classes.deleteButton}
                disabled={isDeleting}
                data-cy="MiniCart-Item-deleteButton"
                aria-label={buttonStatus}
            >
                <Icon
                    size={16}
                    src={DeleteIcon}
                    classes={{
                        icon: classes.editIcon
                    }}
                />
            </button>
            <span
                className={classes.hide}
                role="status"
                aria-hidden="false"
                aria-live="polite"
            >
                {announceCartCount}
            </span>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string
    }),
    product: shape({
        name: string,
        thumbnail: shape({
            url: string
        })
    }),
    id: string,
    quantity: number,
    configurable_options: arrayOf(
        shape({
            id: number,
            option_label: string,
            value_id: number,
            value_label: string
        })
    ),
    handleRemoveItem: func,
    prices: shape({
        price: shape({
            value: number,
            currency: string
        })
    }),
    configured_variant: shape({
        thumbnail: shape({
            url: string
        })
    }),
    configurableThumbnailSource: oneOf(['parent', 'itself'])
};
