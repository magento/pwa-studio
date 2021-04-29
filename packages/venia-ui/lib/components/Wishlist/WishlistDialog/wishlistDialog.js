import React, { Fragment, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Relevant } from 'informed';

import { useWishlistDialog } from '@magento/peregrine/lib/talons/Wishlist/useWishlistDialog';

import Dialog from '@magento/venia-ui/lib/components/Dialog';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';

import CreateWishlistForm from './CreateWishlistForm';
import WishlistLineItem from './WishlistLineItem';

import defaultClasses from './wishlistDialog.css';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';

const WishlistDialog = props => {
    const { isOpen, itemOptions, onClose, onSubmit, errors, isLoading } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useWishlistDialog({
        itemOptions,
        onClose
    });

    const {
        canCreateWishlist,
        handleCancel,
        handleNewListClick,
        handleCancelNewList,
        isFormOpen,
        wishlistsData
    } = talonProps;

    const { formatMessage } = useIntl();

    const createButtonText = formatMessage({
        id: 'wishlistDialog.createButton',
        defaultMessage: '+ Create a new list'
    });

    const maybeListsElement = useMemo(() => {
        if (wishlistsData) {
            const wishlists = wishlistsData.customer.wishlists.map(wishlist => {
                const name = `"${wishlist.name}"`;
                return (
                    <li key={wishlist.id}>
                        <WishlistLineItem
                            id={wishlist.id}
                            isDisabled={isLoading}
                            onClick={onSubmit}
                        >
                            {name}
                        </WishlistLineItem>
                    </li>
                );
            });
            return <ul className={classes.existingWishlists}>{wishlists}</ul>;
        } else {
            return null;
        }
    }, [classes.existingWishlists, onSubmit, isLoading, wishlistsData]);

    const shouldRenderForm = useCallback(() => !!isFormOpen, [isFormOpen]);

    const maybeNewListElement = canCreateWishlist ? (
        <Fragment>
            <button
                className={classes.createListButton}
                onClick={handleNewListClick}
                type="button"
            >
                {createButtonText}
            </button>
            <Relevant when={shouldRenderForm}>
                <CreateWishlistForm
                    onCreateList={onSubmit}
                    isAddLoading={isLoading}
                    onCancel={handleCancelNewList}
                />
            </Relevant>
        </Fragment>
    ) : null;

    return (
        <Dialog
            isOpen={isOpen}
            onCancel={handleCancel}
            shouldShowButtons={false}
            title={formatMessage({
                id: 'wishlistDialog.title',
                defaultMessage: 'Add to Favorites'
            })}
        >
            <div className={classes.root}>
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors}
                />
                {maybeListsElement}
                {maybeNewListElement}
            </div>
        </Dialog>
    );
};

export default WishlistDialog;

WishlistDialog.defaultProps = {
    classes: shape({}),
    isOpen: bool,
    itemOptions: shape({
        entered_options: arrayOf(
            shape({
                uid: number.isRequired,
                value: string.isRequired
            })
        ),
        parent_sku: string,
        sku: string.isRequired,
        selected_options: arrayOf(string),
        quantity: number.isRequired
    }),
    onClose: func
};
