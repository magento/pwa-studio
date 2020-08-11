import React, { useMemo } from 'react';
import { useWishlistPage } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistPage';

import { mergeClasses } from '../../classify';
import Wishlist from './wishlist';
import defaultClasses from './wishlistPage.css';
import WishlistPageOperations from './wishlistPage.gql';
import CreateWishlist from './createWishlist';

const WishlistPage = props => {
    const talonProps = useWishlistPage({
        ...WishlistPageOperations
    });
    const { wishlists } = talonProps;

    const wishlistElements = useMemo(() => {
        return wishlists.map(wishlist => (
            <Wishlist key={wishlist.id} data={wishlist} />
        ));
    }, [wishlists]);

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h1 className={classes.heading}>{'Favorites Lists'}</h1>
            {wishlistElements}
            <CreateWishlist />
        </div>
    );
};

export default WishlistPage;
