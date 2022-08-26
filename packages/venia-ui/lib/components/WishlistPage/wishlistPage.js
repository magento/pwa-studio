import React, { Fragment, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWishlistPage } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistPage';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

import { useStyle } from '../../classify';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import Wishlist from './wishlist';
import defaultClasses from './wishlistPage.module.css';

import CreateWishlist from './createWishlist';

const WishlistPage = props => {
    const talonProps = useWishlistPage();
    const {
        errors,
        loading,
        shouldRenderVisibilityToggle,
        wishlists
    } = talonProps;
    const { formatMessage } = useIntl();
    const error = errors.get('getCustomerWishlistQuery');

    const classes = useStyle(defaultClasses, props.classes);
    const WISHLIST_DISABLED_MESSAGE = formatMessage({
        id: 'wishlistPage.wishlistDisabledMessage',
        defaultMessage: 'The wishlist is not currently available.'
    });
    const wishlistElements = useMemo(() => {
        if (wishlists.length === 0) {
            return <Wishlist />;
        }

        return wishlists.map((wishlist, index) => (
            <Wishlist
                key={wishlist.id}
                isCollapsed={index !== 0}
                data={wishlist}
                shouldRenderVisibilityToggle={shouldRenderVisibilityToggle}
            />
        ));
    }, [shouldRenderVisibilityToggle, wishlists]);

    if (loading && !error) {
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
                <CreateWishlist numberOfWishlists={wishlists.length} />
            </Fragment>
        );
    }

    return (
        <div className={classes.root} data-cy="Wishlist-root">
            <h1
                aria-live="polite"
                className={classes.heading}
                data-cy="WishlistPage-heading"
            >
                <FormattedMessage
                    values={{ count: wishlists.length }}
                    id={'wishlistPage.headingText'}
                    defaultMessage={
                        '{count, plural, one {Favorites List} other {Favorites Lists}}'
                    }
                />
            </h1>
            {content}
        </div>
    );
};

export default WishlistPage;
