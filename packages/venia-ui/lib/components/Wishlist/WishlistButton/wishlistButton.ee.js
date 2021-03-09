import React, { useCallback } from 'react';
import { Heart } from 'react-feather';
import { useIntl } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './wishlistButton.css';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { gql, useMutation } from '@apollo/client';

const ADD_TO_WISHLIST = gql`
    mutation addProductToWishlist($id: ID!, $itemOptions: WishlistItemInput!) {
        addProductsToWishlist(wishlistId: $id, wishlistItems: [$itemOptions]) {
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

    const [addProductToWishlist, { loading: isAddLoading }] = useMutation(
        ADD_TO_WISHLIST
    );

    const handleClick = useCallback(async () => {
        alert('opening dialog');
        // try {
        //     await addProductToWishlist({
        //         variables: {
        //             id: 3, // TODO: CE only has single wishlist.
        //             itemOptions: props.itemOptions
        //         }
        //     });
        // } catch (err) {
        //     console.log(err);
        // }
    }, []);

    const buttonText = formatMessage({
        id: 'wishlistButton.addText',
        defaultMessage: 'Add to Favorites'
    });

    const isDisabled = isAddLoading;

    let buttonClass;
    let iconClass;

    if (isDisabled) {
        buttonClass = classes.wishlistButton_disabled;
        iconClass = classes.icon_disabled;
    } else {
        buttonClass = classes.wishlistButton;
        iconClass = classes.icon;
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
