import React from 'react';
import { shape, string } from 'prop-types';
import { ShoppingBag as ShoppingCartIcon } from 'react-feather';

import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';

import { mergeClasses } from '../../classify';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import Icon from '../Icon';
import defaultClasses from './cartTrigger.css';
import { GET_ITEM_COUNT_QUERY } from './cartTrigger.gql';

const CartTrigger = props => {
    const { handleClick, itemCount } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const classes = mergeClasses(defaultClasses, props.classes);
    const isFilled = itemCount > 0;
    const iconClass = isFilled ? classes.icon_filled : classes.icon_empty;
    const extraItems = itemCount > 99 ? classes.counter_extra_items : null;
    const iconClasses = { root: iconClass };
    const buttonAriaLabel = `Toggle mini cart. You have ${itemCount} items in your cart.`;
    let iconSize = null;
    if (window.matchMedia('(min-width: 641px)').matches) {
        iconSize = 28;
    }

    const itemCounter = itemCount ? (
        <span className={[classes.counter, extraItems].join(' ')}>
            {itemCount}
        </span>
    ) : null;

    return (
        <button
            aria-label={buttonAriaLabel}
            className={classes.root}
            onClick={handleClick}
        >
            <Icon
                size={iconSize}
                classes={iconClasses}
                src={ShoppingCartIcon}
            />
            {itemCounter}
        </button>
    );
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        icon_empty: string,
        icon_filled: string,
        counter_extra_items: string,
        root: string
    })
};
