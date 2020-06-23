import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { ShoppingBag as ShoppingCartIcon } from 'react-feather';

import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';

import { mergeClasses } from '../../classify';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import Icon from '../Icon';
import ShoppingBag from '../ShoppingBag';
import defaultClasses from './cartTrigger.css';
import { GET_ITEM_COUNT_QUERY } from './cartTrigger.gql';

const shouldUseShoppingBag = process.env.APP_USE_SHOPPING_BAG;
console.log('shouldUseShoppingBag', shouldUseShoppingBag);

const CartTrigger = props => {
    const {
        handleClick,
        handleDesktopClick,
        handleMobileClick,
        itemCount,
        shoppingBagIsOpen,
        setShoppingBagIsOpen
    } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const classes = mergeClasses(defaultClasses, props.classes);
    const backgroundClass = shoppingBagIsOpen
        ? classes.background_open
        : classes.background;
    const buttonAriaLabel = `Toggle mini cart. You have ${itemCount} items in your cart.`;
    const itemCountDisplay = itemCount > 99 ? '99+' : itemCount;

    const itemCounter = itemCount ? (
        <span className={classes.counter}>{itemCountDisplay}</span>
    ) : null;

    // Because this button behaves differently on desktop and mobile
    // we render two buttons that differ only in their click handler
    // and control which one displays via CSS.
    const cartTrigger = shouldUseShoppingBag ? (
        <Fragment>
            <div className={backgroundClass}>
                <button
                    aria-label={buttonAriaLabel}
                    className={classes.trigger}
                    onClick={handleDesktopClick}
                >
                    <Icon src={ShoppingCartIcon} />
                    {itemCounter}
                </button>
            </div>
            <button
                aria-label={buttonAriaLabel}
                className={classes.link}
                onClick={handleMobileClick}
            >
                <Icon src={ShoppingCartIcon} />
                {itemCounter}
            </button>
            <ShoppingBag
                isOpen={shoppingBagIsOpen}
                setIsOpen={setShoppingBagIsOpen}
            />
        </Fragment>
    ) : (
        <button
            aria-label={buttonAriaLabel}
            className={classes.trigger}
            onClick={handleClick}
        >
            <Icon src={ShoppingCartIcon} />
            {itemCounter}
        </button>
    );

    return cartTrigger;
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        root: string
    })
};
