import React, { Fragment, useMemo } from 'react';
import { useWishlistItems } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItems';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/WishlistPage/wishlistItems.module.css';
import WishlistItem from '@magento/venia-ui/lib/components/WishlistPage/wishlistItem';
import AddToCartDialog from '@magento/venia-ui/lib/components/AddToCartDialog';

const WishlistItems = React.forwardRef((props, ref) => {
    const { items, wishlistId } = props;

    const talonProps = useWishlistItems();
    const {
        activeAddToCartItem,
        handleCloseAddToCartDialog,
        handleOpenAddToCartDialog
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const itemElements = useMemo(() => {
        return items.map(item => {
            return (
                <WishlistItem
                    ref={ref}
                    key={item.id}
                    item={item}
                    onOpenAddToCartDialog={handleOpenAddToCartDialog}
                    wishlistId={wishlistId}
                />
            );
        });
    }, [handleOpenAddToCartDialog, items, wishlistId]);

    return (
        <Fragment>
            <div className={classes.root} ref={ref}>
                {itemElements}
            </div>
            <AddToCartDialog
                item={activeAddToCartItem}
                onClose={handleCloseAddToCartDialog}
            />
        </Fragment>
    );
});

export default WishlistItems;
