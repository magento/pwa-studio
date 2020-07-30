import React from 'react';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';

import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

import PriceAdjustments from './PriceAdjustments';
import PriceSummary from './PriceSummary';
import ProductListing from './ProductListing';
import { mergeClasses } from '../../classify';
import defaultClasses from './cartPage.css';
import { GET_CART_DETAILS } from './cartPage.gql';
import LinkButton from '../LinkButton';

const CartPage = props => {
    const talonProps = useCartPage({
        queries: {
            getCartDetails: GET_CART_DETAILS
        }
    });

    const {
        handleSignIn,
        hasItems,
        hasOutOfStockItem,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    const signInDisplay = !isSignedIn ? (
        <LinkButton
            classes={{ root: classes.signInLink }}
            onClick={handleSignIn}
        >
            {'Sign In'}
        </LinkButton>
    ) : null;

    const stockStatusMessageElement = hasOutOfStockItem ? (
        <span className={classes.stockStatusMessage}>
            {
                'An item in your cart is currently out-of-stock and must be removed in order to Checkout.'
            }
        </span>
    ) : null;

    const productListing = hasItems ? (
        <ProductListing setIsCartUpdating={setIsCartUpdating} />
    ) : (
        <h3>There are no items in your cart.</h3>
    );

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={setIsCartUpdating} />
    ) : null;
    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating} />
    ) : null;

    return (
        <div className={classes.root}>
            <Title>{`Cart - ${STORE_NAME}`}</Title>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>Cart</h1>
                {signInDisplay}
                {stockStatusMessageElement}
            </div>
            <div className={classes.body}>
                <div className={classes.items_container}>{productListing}</div>
                <div className={classes.price_adjustments_container}>
                    {priceAdjustments}
                </div>
                <div className={classes.summary_container}>
                    <div className={classes.summary_contents}>
                        {priceSummary}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
