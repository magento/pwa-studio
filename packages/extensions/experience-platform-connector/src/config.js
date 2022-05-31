import { default as addToCartHandler } from './handlers/addToCart';
import { default as completeCheckoutHandler } from './handlers/completeCheckout';
import { default as createAccountHandler } from './handlers/createAccount';
import { default as editAccountHandler } from './handlers/editAccount';
import { default as pageViewHandler } from './handlers/pageViewHandler';
import { default as placeOrderHandler } from './handlers/placeOrder';
import { default as productPageViewHandler } from './handlers/productPageView';
import { default as searchRequestSentHandler } from './handlers/searchRequestSent';
import { default as searchResponseReceivedHandler } from './handlers/searchResponseReceived';
import { default as shoppingCartViewHandler } from './handlers/shoppingCartView';
import { default as startCheckoutHandler } from './handlers/startCheckout';
import { default as signInHandler } from './handlers/signIn';
import { default as signOutHandler } from './handlers/signOut';

export default [
    addToCartHandler,
    completeCheckoutHandler,
    createAccountHandler,
    editAccountHandler,
    pageViewHandler,
    placeOrderHandler,
    productPageViewHandler,
    searchRequestSentHandler,
    searchResponseReceivedHandler,
    shoppingCartViewHandler,
    startCheckoutHandler,
    signInHandler,
    signOutHandler
];
