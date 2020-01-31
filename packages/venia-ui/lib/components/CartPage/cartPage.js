import React, { useMemo } from 'react';
import gql from 'graphql-tag';

import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';

import Button from '../Button';
import PriceAdjustments from './PriceAdjustments';
import PriceSummary from './PriceSummary';
import ProductListing from './ProductListing';
import { mergeClasses } from '../../classify';
import defaultClasses from './cartPage.css';
import { CartPageFragment } from './cartPageFragments';

const CartPage = props => {
    const talonProps = useCartPage({
        cartPageQuery: GET_CART_DETAILS
    });
    const { handleSignIn, hasItems, isSignedIn } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const signInDisplay = useMemo(() => {
        return !isSignedIn ? (
            <Button
                className={classes.sign_in}
                onClick={handleSignIn}
                priority="high"
            >
                {'Sign In'}
            </Button>
        ) : null;
    }, [classes.sign_in, handleSignIn, isSignedIn]);

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>Cart</h1>
                {signInDisplay}
            </div>
            <div className={classes.body}>
                <div className={classes.items_container}>
                    {hasItems ? (
                        <ProductListing />
                    ) : (
                        <h3>There are no items in your cart.</h3>
                    )}
                </div>
                <div className={classes.price_adjustments_container}>
                    {hasItems ? <PriceAdjustments /> : null}
                </div>
                <div className={classes.summary_container}>
                    <div className={classes.summary_contents}>
                        {hasItems ? <PriceSummary /> : null}
                    </div>
                </div>
                <div className={classes.recently_viewed_container}>
                    <a href="https://jira.corp.magento.com/browse/PWA-270">
                        Recently Viewed to be completed by PWA-270.
                    </a>
                </div>
            </div>
        </div>
    );
};

const GET_CART_DETAILS = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;

export default CartPage;
