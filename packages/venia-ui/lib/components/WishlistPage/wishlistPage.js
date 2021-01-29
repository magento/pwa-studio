import React, { Fragment, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWishlistPage } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistPage';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

import { mergeClasses } from '../../classify';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import Wishlist from './wishlist';
import defaultClasses from './wishlistPage.css';
import WishlistPageOperations from './wishlistPage.gql';
import CreateWishlist from './createWishlist';

const WishlistPage = props => {
    const talonProps = useWishlistPage({ ...WishlistPageOperations });
    const { errors, wishlists } = talonProps;
    const { formatMessage } = useIntl();
    const error = errors.get('getCustomerWishlistQuery');

    const classes = mergeClasses(defaultClasses, props.classes);
    const WISHLIST_DISABLED_MESSAGE = formatMessage({
        id: 'wishlistPage.wishlistDisabledMessage',
        defaultMessage: 'The wishlist is not currently available.'
    });
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
                <p>
                    <FormattedMessage
                        id={'wishlistPage.disabledMessage'}
                        defaultMessage={
                            'Sorry, this feature has been disabled.'
                        }
                    />
                </p>
            ) : (
                <p className={classes.fetchError}>
                    <FormattedMessage
                        id={'wishlistPage.fetchErrorMessage'}
                        defaultMessage={
                            'Something went wrong. Please refresh and try again.'
                        }
                    />
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
            <h1 className={classes.heading}>
                <FormattedMessage
                    id={'wishlistPage.headingText'}
                    defaultMessage={'Favorites Lists'}
                />
            </h1>
            {content}
        </div>
    );
};

export default WishlistPage;
