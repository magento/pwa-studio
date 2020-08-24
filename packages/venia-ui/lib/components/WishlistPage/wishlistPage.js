import React, { Fragment, useMemo } from 'react';
import { useWishlistPage } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistPage';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

import { mergeClasses } from '../../classify';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import Wishlist from './wishlist';
import defaultClasses from './wishlistPage.css';
import WishlistPageOperations from './wishlistPage.gql';
import CreateWishlist from './createWishlist';

const WISHLIST_DISABLED_MESSAGE = 'The wishlist is not currently available.';

const WishlistPage = props => {
    const talonProps = useWishlistPage({
        ...WishlistPageOperations
    });
    const { errors, wishlists } = talonProps;
    const error = errors.get('getCustomerWishlistQuery');

    const classes = mergeClasses(defaultClasses, props.classes);

    const wishlistElements = useMemo(() => {
        return wishlists.map(wishlist => (
            <Wishlist key={wishlist.id} data={wishlist} />
        ));
    }, [wishlists]);

    if (!wishlists.length && !error) {
        return fullPageLoadingIndicator;
    }

    let content;
    if (error) {
        const derivedErrorMessage = deriveErrorMessage([error]);
        const errorElement =
            derivedErrorMessage === WISHLIST_DISABLED_MESSAGE ? (
                <p>{'Sorry, this feature has been disabled.'}</p>
            ) : (
                <p className={classes.fetchError}>
                    {'Something went wrong. Please refresh and try again.'}
                </p>
            );

        content = <div className={classes.errorContainer}>{errorElement}</div>;
    } else {
        content = (
            <Fragment>
                {wishlistElements}
                <CreateWishlist />
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <h1 className={classes.heading}>{'Favorites Lists'}</h1>
            {content}
        </div>
    );
};

export default WishlistPage;
