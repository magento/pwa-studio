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
    const buttonAriaLabel = `Toggle mini cart. You have ${itemCount} items in your cart.`;
    const itemCountDisplay = itemCount > 99 ? '99+' : itemCount;

    const itemCounter = itemCount ? (
        <span className={classes.counter}>{itemCountDisplay}</span>
    ) : null;

    return (
        <button
            aria-label={buttonAriaLabel}
            className={classes.root}
            onClick={handleClick}
        >
            <Icon src={ShoppingCartIcon} />
            {itemCounter}
        </button>
    );
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        root: string
    })
};
