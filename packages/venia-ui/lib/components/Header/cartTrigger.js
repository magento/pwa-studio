import React from 'react';
import { shape, string } from 'prop-types';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';

import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';

import Icon from '../Icon';
import { mergeClasses } from '../../classify';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import defaultClasses from './cartTrigger.css';

const CartTrigger = props => {
    const { handleClick, itemCount } = useCartTrigger({
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY
    });

    const iconColor = props.iconColor;
    const classes = mergeClasses(defaultClasses, props.classes);

    const cartIcon =
        itemCount > 0 ? (
            <Icon
                src={ShoppingCartIcon}
                attrs={{
                    fill: iconColor,
                    stroke: iconColor
                }}
            />
        ) : (
            <Icon
                src={ShoppingCartIcon}
                attrs={{
                    stroke: iconColor
                }}
            />
        );

    const buttonAriaLabel = `Toggle mini cart. You have ${itemCount} items in your cart.`;

    const itemCounter = itemCount ? (
        <span className={classes.counter}>{itemCount}</span>
    ) : null;

    return (
        <button
            className={classes.root}
            aria-label={buttonAriaLabel}
            onClick={handleClick}
        >
            {cartIcon}
            {itemCounter}
        </button>
    );
};

CartTrigger.propTypes = {
    iconColor: string,
    classes: shape({
        root: string
    })
};

CartTrigger.defaultProps = {
    iconColor: 'rgb(var(--venia-text))'
};

export default CartTrigger;
