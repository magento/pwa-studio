import React, { useEffect } from 'react';
import { AlertCircle, Heart } from 'react-feather';
import { useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine';
import { useWishlistButton } from '@magento/peregrine/lib/talons/Wishlist/WishlistButton/useWishlistButton';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './wishlistButton.css';
import { arrayOf, bool, number, shape, string } from 'prop-types';

const ErrorIcon = <Icon src={AlertCircle} attrs={{ width: 18 }} />;

const WishlistButton = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useWishlistButton({ itemOptions: props.itemOptions });

    const { addProductError, handleClick, isDisabled, itemAdded } = talonProps;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (addProductError) {
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
        }
    }, [addProductError, addToast, formatMessage]);

    const buttonText = itemAdded
        ? formatMessage({
              id: 'wishlistButton.addedText',
              defaultMessage: 'Added to Favorites'
          })
        : formatMessage({
              id: 'wishlistButton.addText',
              defaultMessage: 'Add to Favorites'
          });

    let buttonClass;
    let iconClass;

    if (isDisabled) {
        buttonClass = classes.wishlistButton_disabled;
        if (itemAdded) {
            iconClass = classes.icon_filled_disabled;
        } else {
            iconClass = classes.icon_disabled;
        }
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
