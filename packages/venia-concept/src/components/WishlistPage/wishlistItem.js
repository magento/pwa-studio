import React, { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';
import { useWishlistItem } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItem';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './wishlistItem.module.css';
import orangeThrashCan from './assets/orangeThrashCan.svg';
import ShareIcon from './assets/share.svg';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

const WishlistItem = props => {
    const { item } = props;
    const { url_key, url_suffix, sku, __typename: typename, price } = item.product;
    const { minimalPrice, regularPrice } = price;

    const { configurable_options: configurableOptions = [], product } = item;
    const { name, price_range: priceRange, stock_status: stockStatus } = product;

    const productLink = resourceUrl(`/${url_key}${url_suffix || ''}`);
    const simpleProductLink = `/simple-product?sku=${sku}`;

    const actualProductLink = typename === 'ConfigurableProduct' ? productLink : simpleProductLink;

    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const talonProps = useWishlistItem(props);
    const {
        addToCartButtonProps,
        handleRemoveProductFromWishlist,
        hasError,
        isRemovalInProgress,
        isSupportedProductType
    } = talonProps;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'wishlistItem.addToCartError',
                    defaultMessage: 'Something went wrong. Please refresh and try again.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, hasError]);

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.origin + actualProductLink);
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'quickOrder.copiedUrl',
                defaultMessage: 'The product URL was copied to the clipboard'
            })
        });
    };

    const classes = useStyle(defaultClasses, props.classes);

    const optionElements = useMemo(() => {
        return configurableOptions.map(option => {
            const { id, option_label: optionLabel, value_label: valueLabel } = option;

            const optionString = `${optionLabel} : ${valueLabel}`;

            return (
                <span className={classes.option} key={id}>
                    {optionString}
                </span>
            );
        });
    }, [classes.option, configurableOptions]);

    const imageProps = {
        classes: {
            image: stockStatus === 'OUT_OF_STOCK' ? classes.image_disabled : classes.image
        },
        ...talonProps.imageProps
    };

    const removeProductAriaLabel = formatMessage({
        id: 'wishlistItem.removeAriaLabel',
        defaultMessage: 'Remove Product from wishlist'
    });

    const rootClass = isRemovalInProgress ? classes.root_disabled : classes.root;

    const addToCart = isSupportedProductType ? (
        <button className={classes.addToCart} {...addToCartButtonProps} data-cy="wishlistItem-addToCart">
            {formatMessage({
                id: 'wishlistItem.addToCart',
                defaultMessage: 'Add to Cart'
            })}
        </button>
    ) : null;

    const discount = Math.round(100 - (minimalPrice?.amount.value / regularPrice?.amount.value) * 100);

    return (
        <div className={rootClass} data-cy="wishlistItem-root">
            <article className={classes.imageContainer}>
                {discount ? (
                    <div className={classes.discount}>
                        <span>{discount}%</span>
                    </div>
                ) : null}
                <Image {...imageProps} />
            </article>
            <div className={classes.actionWrap}>
                <span className={classes.name} data-cy="wishlistItem-productName">
                    {name}
                </span>{' '}
                <article className={classes.shareAndCanContainer}>
                    <button onClick={handleShareClick} className={classes.shareIcon}>
                        <img src={ShareIcon} alt="share icon" />
                    </button>
                    <button
                        className={classes.deleteItem}
                        onClick={handleRemoveProductFromWishlist}
                        aria-label={removeProductAriaLabel}
                        data-cy="wishlistItem-deleteItem"
                    >
                        <img src={orangeThrashCan} alt="orangeThrashCan" />
                    </button>
                </article>
            </div>

            <div className={classes.priceContainer} data-cy="wishlistItem-priceContainer">
                <Price currencyCode={currency} value={unitPrice} />
            </div>
            <article className={classes.optionContainer}> {optionElements}</article>
            {addToCart}
        </div>
    );
};

export default WishlistItem;
