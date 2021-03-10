import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Heart } from 'react-feather';
import { useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './wishlistButton.css';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { gql, useMutation } from '@apollo/client';

const ErrorIcon = <Icon src={AlertCircle} attrs={{ width: 18 }} />;

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

    const { itemOptions } = props;

    const { formatMessage } = useIntl();

    // TODO: Using local state is a temporary solution. The real solution will be some check to see if the sku (for simple items) or sku + selected_options (for configurable) exists in a wishlist (or _the_ wishlist for CE). Currently, there seems to be a server error when attempting to query for `configurable_product_option_value_uid` on ConfigurableWishlistItem.configurable_options.
    const [itemAdded, setItemAdded] = useState(false);

    // TODO: As with above, this just mimics the behavior we anticipate - you can add a product with any number of selected options to your wishlist, so whenever you change options, indicate that this new selection is _not_ in the list. We can remove this when we fix the server error.
    useEffect(() => {
        if (itemOptions.selected_options) setItemAdded(false);
    }, [itemOptions.selected_options]);

    const [, { addToast }] = useToasts();

    const [addProductToWishlist, { loading: isAddLoading }] = useMutation(
        ADD_TO_WISHLIST
    );

    const handleClick = useCallback(async () => {
        try {
            await addProductToWishlist({
                variables: {
                    // TODO: "0" will create a wishlist if doesn't exist, and add to one if it does, regardless of the user's single wishlist id. In 2.4.3 this will be "fixed" by removing the `wishlistId` param entirely because all users will have a wishlist created automatically in CE. So should only have to pass items and it will add correctly.
                    wishlistId: '0',
                    itemOptions
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
    }, [addProductToWishlist, addToast, formatMessage, itemOptions]);

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
        selected_options: arrayOf(string),
        quantity: number.isRequired
    })
};
