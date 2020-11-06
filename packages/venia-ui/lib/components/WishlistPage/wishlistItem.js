import React, { useEffect } from 'react';
import { MoreHorizontal } from 'react-feather';
import { useIntl } from 'react-intl';
import { Price, useToasts } from '@magento/peregrine';
import { useWishlistItem } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItem';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import Image from '../Image';
import WishlistConfirmRemoveProductDialog from './wishlistConfirmRemoveProductDialog';
import WishlistMoreActionsDialog from './wishlistMoreActionsDialog';
import defaultClasses from './wishlistItem.css';
import wishlistItemOperations from './wishlistItem.gql';

const WishlistItem = props => {
    const { item, wishlistId } = props;

    const {
        child_sku: childSku,
        configurable_options: configurableOptions = [],
        id: itemId,
        product
    } = item;
    const { image, name, price_range: priceRange, sku } = product;

    const { label: imageLabel, url } = image;

    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const talonProps = useWishlistItem({
        childSku,
        itemId,
        operations: { ...wishlistItemOperations },
        sku,
        wishlistId
    });
    const {
        confirmRemovalIsOpen,
        handleAddToCart,
        handleHideDialogs,
        handleRemoveProductFromWishlist,
        handleShowConfirmRemoval,
        handleShowMoreActions,
        hasError,
        hasRemoveProductFromWishlistError,
        isLoading,
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

    const optionElements = configurableOptions.map(option => {
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

    return (
        <div className={classes.root}>
            <Image
                alt={imageLabel}
                classes={{ image: classes.image }}
                src={url}
                width={400}
            />
            <span className={classes.name}>{name}</span>
            {optionElements}
            <div className={classes.priceContainer}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
            <div className={classes.actionsContainer}>
                <button
                    className={classes.addToCart}
                    disabled={isLoading}
                    onClick={handleAddToCart}
                >
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
        </div>
    );
};

export default WishlistItem;
