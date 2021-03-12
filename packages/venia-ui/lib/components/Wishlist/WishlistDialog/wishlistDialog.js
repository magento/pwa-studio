import React, { Fragment, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Relevant } from 'informed';

import { useWishlistDialog } from '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/useWishlistDialog';

import Dialog from '@magento/venia-ui/lib/components/Dialog';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './wishlistDialog.css';
import NewWishlistForm from './NewWishlistForm/newWishlistForm';
import FormError from '../../FormError';
import WishlistLineItem from './wishlistLineItem';

const WishlistDialog = props => {
    const { isOpen, onClose } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useWishlistDialog({
        itemOptions: props.itemOptions,
        onClose
    });

    const { formatMessage } = useIntl();

    const {
        canCreateWishlist,
        formErrors,
        handleAddToWishlist,
        handleCancel,
        handleNewListClick,
        isAddLoading,
        isFormOpen,
        wishlistsData
    } = talonProps;

    const maybeListsElement = useMemo(() => {
        if (wishlistsData) {
            const wishlists = wishlistsData.customer.wishlists.map(wishlist => {
                const name = `"${wishlist.name}"`;
                return (
                    <Fragment key={wishlist.id}>
                        <li>
                            <WishlistLineItem
                                id={wishlist.id}
                                isDisabled={isAddLoading}
                                onClick={handleAddToWishlist}
                            >
                                {name}
                            </WishlistLineItem>
                        </li>
                        <hr />
                    </Fragment>
                );
            });
            return <ul>{wishlists}</ul>;
        } else {
            return null;
        }
    }, [handleAddToWishlist, isAddLoading, wishlistsData]);

    const shouldRenderForm = useCallback(() => !!isFormOpen, [isFormOpen]);

    const maybeNewListElement = canCreateWishlist ? (
        <Relevant when={shouldRenderForm}>
            <NewWishlistForm
                onCreateList={handleAddToWishlist}
                isAddLoading={isAddLoading}
                onCancel={handleCancel}
            />
        </Relevant>
    ) : null;

    const createButtonText = formatMessage({
        id: 'newWishlistForm.createButton',
        defaultMessage: '+ Create a new list'
    });

    return (
        <Dialog
            isOpen={isOpen}
            onCancel={onClose}
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
                    errors={formErrors}
                />
                {maybeListsElement}
                <button onClick={handleNewListClick} type="button">
                    {createButtonText}
                </button>
                {maybeNewListElement}
            </div>
        </Dialog>
    );
};

export default WishlistDialog;
