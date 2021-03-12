import React, { Fragment, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useWishlistDialog } from '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/useWishlistDialog';

import Dialog from '@magento/venia-ui/lib/components/Dialog';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './wishlistDialog.css';
import NewWishlistForm from './NewWishlistForm/newWishlistForm';
import FormError from '../../FormError';

const WishlistEntry = props => {
    const { id, onClick } = props;

    const handleClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <button type="button" onClick={handleClick}>
            {props.children}
        </button>
    );
};

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
        isAddLoading,
        wishlistsData
    } = talonProps;

    const maybeListsElement = useMemo(() => {
        if (wishlistsData) {
            const wishlists = wishlistsData.customer.wishlists.map(wishlist => {
                const name = `"${wishlist.name}"`;
                return (
                    <Fragment key={wishlist.id}>
                        <li>
                            <WishlistEntry
                                id={wishlist.id}
                                onClick={handleAddToWishlist}
                            >
                                {name}
                            </WishlistEntry>
                        </li>
                        <hr />
                    </Fragment>
                );
            });
            return <ul>{wishlists}</ul>;
        } else {
            return null;
        }
    }, [handleAddToWishlist, wishlistsData]);

    const maybeNewListElement = canCreateWishlist ? (
        <NewWishlistForm
            onCreateList={handleAddToWishlist}
            isAddLoading={isAddLoading}
        />
    ) : null;

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
                {maybeNewListElement}
            </div>
        </Dialog>
    );
};

export default WishlistDialog;
