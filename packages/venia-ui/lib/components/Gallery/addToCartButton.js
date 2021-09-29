import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { string, number, shape } from 'prop-types';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';
import { ShoppingBag, XSquare } from 'react-feather';
import Icon from '../Icon';
import Button from '../Button';
import { mergeClasses } from '../../classify';
import defaultClasses from './addToCartButton.module.css';

const AddToCartIcon = (
    <Icon
        classes={{ icon: defaultClasses.icon }}
        src={ShoppingBag}
        attrs={{ width: 16 }}
    />
);
const OutOfStockIcon = (
    <Icon
        classes={{ icon: defaultClasses.icon }}
        src={XSquare}
        attrs={{ width: 16 }}
    />
);

const AddToCartButton = props => {
    const talonProps = useAddToCartButton({
        item: props.item
    });
    const { handleAddToCart, isDisabled, isInStock } = talonProps;
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);

    const buttonText = isInStock ? (
        <FormattedMessage
            id="addToCartButton.addItemToCart"
            defaultMessage="ADD TO CART"
        />
    ) : (
        <FormattedMessage
            id="addToCartButton.itemOutOfStock"
            defaultMessage="OUT OF STOCK"
        />
    );

    const buttonAriaLabel = formatMessage({
        id: isInStock
            ? 'addToCartButton.addItemToCartAriaLabel'
            : 'addToCartButton.itemOutOfStockAriaLabel',
        defaultMessage: isInStock ? 'Add to cart' : 'Out of stock'
    });

    const buttonIcon = isInStock ? AddToCartIcon : OutOfStockIcon;

    return (
        <Button
            aria-label={buttonAriaLabel}
            className={classes.root}
            disabled={isDisabled}
            onPress={handleAddToCart}
            priority="high"
            type="button"
        >
            {buttonIcon}
            <span className={classes.text}>{buttonText}</span>
        </Button>
    );
};

export default AddToCartButton;

AddToCartButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
    }),
    item: shape({
        id: number,
        name: string,
        small_image: shape({
            url: string
        }),
        stock_status: string.isRequired,
        type_id: string.isRequired,
        url_key: string.isRequired,
        url_suffix: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number,
                    currency: string
                })
            })
        })
    })
};
