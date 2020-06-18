import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';

import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';

import { mergeClasses } from '../../classify';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import Icon from '../Icon';
import MiniCart from '../MiniCart2';
import defaultClasses from './cartTrigger.css';
import { GET_ITEM_COUNT_QUERY } from './cartTrigger.gql';

const CartTrigger = props => {
    const {
        handleDesktopClick,
        handleMobileClick,
        itemCount,
        miniCartIsOpen,
        setMiniCartIsOpen
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
    const backgroundClass = miniCartIsOpen ? classes.background_open : classes.background;
    const isFilled = itemCount > 0;
    const iconClass = isFilled ? classes.icon_filled : classes.icon_empty;
    const iconClasses = { root: iconClass };
    const buttonAriaLabel = `Toggle mini cart. You have ${itemCount} items in your cart.`;

    const itemCounter = itemCount ? (
        <span className={classes.counter}>{itemCount}</span>
    ) : null;

    // Because this button behaves differently on desktop and mobile
    // we render two buttons that differ only in their click handler
    // and control which one displays via CSS.
    return (
        <Fragment>
            <div className={backgroundClass}>
                <button
                    aria-label={buttonAriaLabel}
                    className={classes.root_desktop}
                    onClick={handleDesktopClick}
                >
                    <Icon classes={iconClasses} src={ShoppingCartIcon} />
                    {itemCounter}
                </button>
            </div>
            <button
                aria-label={buttonAriaLabel}
                className={classes.root_mobile}
                onClick={handleMobileClick}
            >
                <Icon classes={iconClasses} src={ShoppingCartIcon} />
                {itemCounter}
            </button>
            <MiniCart isOpen={miniCartIsOpen} setIsOpen={setMiniCartIsOpen} />
        </Fragment>
    );
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        icon_empty: string,
        icon_filled: string,
        root: string
    })
};
