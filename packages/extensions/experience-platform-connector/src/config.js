import { default as addToCartHandler } from './handlers/addToCart';
import { default as categoryPageViewHandler } from './handlers/categoryPageView';
import { default as completeCheckoutHandler } from './handlers/completeCheckout';
import { default as createAccountHandler } from './handlers/createAccount';
import { default as editAccountHandler } from './handlers/editAccount';
import { default as pageViewHandler } from './handlers/pageView';
import { default as placeOrderHandler } from './handlers/placeOrder';
import { default as productPageViewHandler } from './handlers/productPageView';
import { default as searchRequestSentHandler } from './handlers/searchRequestSent';
import { default as searchResponseReceivedHandler } from './handlers/searchResponseReceived';
import { default as shoppingCartPageViewHandler } from './handlers/shoppingCartPageView';
import { default as shoppingMiniCartViewHandler } from './handlers/shoppingMiniCartView';
import { default as startCheckoutHandler } from './handlers/startCheckout';
import { default as signInHandler } from './handlers/signIn';

export default [
    addToCartHandler,
    categoryPageViewHandler,
    completeCheckoutHandler,
    createAccountHandler,
    editAccountHandler,
    pageViewHandler,
    placeOrderHandler,
    productPageViewHandler,
    searchRequestSentHandler,
    searchResponseReceivedHandler,
    shoppingCartPageViewHandler,
    shoppingMiniCartViewHandler,
    startCheckoutHandler,
    signInHandler
];
