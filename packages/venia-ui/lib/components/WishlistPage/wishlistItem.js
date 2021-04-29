import React, { useEffect, useMemo } from 'react';
import { MoreHorizontal } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Price, useToasts } from '@magento/peregrine';
import { useWishlistItem } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItem';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import Image from '../Image';
import WishlistConfirmRemoveProductDialog from './wishlistConfirmRemoveProductDialog';
import WishlistMoreActionsDialog from './wishlistMoreActionsDialog';
import defaultClasses from './wishlistItem.css';

const WishlistItem = props => {
    const { item } = props;

    const { configurable_options: configurableOptions = [], product } = item;
    const {
        name,
        price_range: priceRange,
        stock_status: stockStatus
    } = product;

    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const talonProps = useWishlistItem(props);
    const {
        addToCartButtonProps,
        confirmRemovalIsOpen,
        handleHideDialogs,
        handleRemoveProductFromWishlist,
        handleShowConfirmRemoval,
        handleShowMoreActions,
        hasError,
        hasRemoveProductFromWishlistError,
        isRemovalInProgress,
        moreActionsIsOpen
    } = talonProps;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'wishlistItem.addToCartError',
                    defaultMessage:
                        'Something went wrong. Please refresh and try again.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, hasError]);

    const classes = mergeClasses(defaultClasses, props.classes);

    const optionElements = useMemo(() => {
        return configurableOptions.map(option => {
            const {
                id,
                option_label: optionLabel,
                value_label: valueLabel
            } = option;

            const optionString = `${optionLabel} : ${valueLabel}`;

            return (
                <span className={classes.option} key={id}>
                    {optionString}
                </span>
            );
        });
    }, [classes.option, configurableOptions]);

    const outOfStockElement =
        stockStatus === 'OUT_OF_STOCK' ? (
            <span className={classes.outOfStock}>
                <FormattedMessage
                    id="wishlistItem.outOfStock"
                    defaultMessage="Currently out-of-stock"
                />
            </span>
        ) : null;

    const imageProps = {
        classes: {
            image:
                stockStatus === 'OUT_OF_STOCK'
                    ? classes.image_disabled
                    : classes.image
        },
        ...talonProps.imageProps
    };

    return (
        <div className={classes.root}>
            <Image {...imageProps} />
            <span className={classes.name}>{name}</span>
            <div className={classes.priceContainer}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
            {optionElements}
            {outOfStockElement}
            <button className={classes.addToCart} {...addToCartButtonProps}>
                {formatMessage({
                    id: 'wishlistItem.addToCart',
                    defaultMessage: 'Add to Cart'
                })}
            </button>
            <button
                className={classes.moreActions}
                onClick={handleShowMoreActions}
            >
                <Icon size={16} src={MoreHorizontal} />
            </button>
            <WishlistMoreActionsDialog
                isOpen={moreActionsIsOpen}
                onCancel={handleHideDialogs}
                onRemove={handleShowConfirmRemoval}
            />
            <WishlistConfirmRemoveProductDialog
                hasError={hasRemoveProductFromWishlistError}
                isOpen={confirmRemovalIsOpen}
                isRemovalInProgress={isRemovalInProgress}
                onCancel={handleHideDialogs}
                onConfirm={handleRemoveProductFromWishlist}
            />
        </div>
    );
};

export default WishlistItem;
