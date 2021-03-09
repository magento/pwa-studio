import React, { useCallback, useMemo, useState } from 'react';
import { AlertCircle, Heart } from 'react-feather';
import { useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './wishlistButton.css';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { gql, useMutation, useQuery } from '@apollo/client';

const ErrorIcon = <Icon src={AlertCircle} attrs={{ width: 18 }} />;

const GET_WISHLIST_DATA = gql`
    query getWishlistData {
        customer {
            wishlists {
                id
            }
        }
    }
`;
const ADD_TO_WISHLIST = gql`
    mutation addProductToWishlist(
        $wishlistId: ID!
        $itemOptions: WishlistItemInput!
    ) {
        addProductsToWishlist(
            wishlistId: $wishlistId
            wishlistItems: [$itemOptions]
        ) {
            user_errors {
                code
                message
            }
        }
    }
`;

const WishlistButton = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { formatMessage } = useIntl();
    const [itemAdded, setItemAdded] = useState(false);

    const [{ isSignedIn }] = useUserContext();
    const [, { addToast }] = useToasts();
    const { data: wishlistData, loading: wishlistDataLoading } = useQuery(
        GET_WISHLIST_DATA,
        {
            fetchPolicy: 'cache-and-network',
            skip: !isSignedIn
        }
    );

    const [addProductToWishlist, { loading: isAddLoading }] = useMutation(
        ADD_TO_WISHLIST
    );

    const wishlistId = useMemo(() => {
        if (wishlistData) {
            if (wishlistData.customer.wishlists.length) {
                // CE allows only a single wishlist.
                return wishlistData.customer.wishlists[0].id;
            } else {
                // TODO: For some reason, passing a zero _created_ a wishlist during the add operation when there was no other wishlist. Additionally, it doesn't seem to matter, once created, what the wishlist id is for a CE client - passing a zero will always add to the single list. So:
                // Do we even need to query for the wishlist id for CE?
                return 0;
            }
        }
    }, [wishlistData]);

    const handleClick = useCallback(async () => {
        try {
            await addProductToWishlist({
                variables: {
                    wishlistId,
                    itemOptions: props.itemOptions
                }
            });
            setItemAdded(true);
        } catch (err) {
            addToast({
                type: 'error',
                icon: ErrorIcon,
                message: formatMessage({
                    id: 'wishlistButton.addError',
                    defaultMessage:
                        'Something went wrong adding the product to your wishlist.'
                }),
                timeout: 5000
            });

            if (process.env.NODE_ENV === 'production') {
                console.log(err);
            }
        }
    }, [
        addProductToWishlist,
        addToast,
        formatMessage,
        props.itemOptions,
        wishlistId
    ]);

    const buttonText = formatMessage({
        id: 'wishlistButton.addText',
        defaultMessage: 'Add to Favorites'
    });

    const isDisabled = wishlistDataLoading || isAddLoading;

    let buttonClass;
    let iconClass;

    if (isDisabled) {
        buttonClass = classes.wishlistButton_disabled;
        iconClass = classes.icon_disabled;
    } else {
        buttonClass = classes.wishlistButton;
        if (itemAdded) {
            iconClass = classes.icon_filled;
        } else {
            iconClass = classes.icon;
        }
    }

    return (
        <button
            disabled={isDisabled}
            type="button"
            className={buttonClass}
            onClick={handleClick}
        >
            <Icon src={Heart} classes={{ icon: iconClass }} />
            {buttonText}
        </button>
    );
};

export default WishlistButton;

WishlistButton.propTypes = {
    classes: shape({
        wishlistButton: string
    }),
    disabled: bool,
    itemOptions: shape({
        entered_options: arrayOf(
            shape({
                uid: number.isRequired,
                value: string.isRequired
            })
        ),
        parent_sku: string,
        sku: string.isRequired,
        selected_options: arrayOf(number),
        quantity: number.isRequired
    })
};
