import React from 'react';
import { shape, string } from 'prop-types';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';

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

    const { iconColor } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const cartIconAttributes = {
        fill: itemCount ? iconColor : 'none',
        stroke: iconColor
    };

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
            <Icon src={ShoppingCartIcon} attrs={cartIconAttributes} />
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
