import React from 'react';

import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';

import Button from '../Button';

import { mergeClasses } from '../../classify';
import defaultClasses from './cartPage.css';

const CartPage = props => {

    const { handleSignIn, isSignedIn } = useCartPage();

    const classes = mergeClasses(defaultClasses, props.classes);

    const signInDisplay = !isSignedIn ? (
        <Button
            className={classes.sign_in}
            onClick={handleSignIn}
            priority="high"
        >
            {'Sign In'}
        </Button>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>Cart</h1>
                { signInDisplay }
            </div>
            <div className={classes.items_container}>
                <a href="https://jira.corp.magento.com/browse/PWA-238">Items List to be completed by PWA-238</a>.
            </div>
            <div className={classes.price_adjustments_container}>
                <a href="https://jira.corp.magento.com/browse/PWA-241">Price Adjustments to be completed by PWA-241</a>.
            </div>
            <div className={classes.summary_container}>
                <a href="https://jira.corp.magento.com/browse/PWA-240">Order Summary to be completed by PWA-240</a>.
            </div>
            <div className={classes.recently_viewed_container}>
                Recently Viewed TBD. Should show only in Desktop.
            </div>
        </div>
    );
}

export default CartPage;
