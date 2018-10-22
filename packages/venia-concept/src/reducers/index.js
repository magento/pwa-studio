import { combineReducers } from 'redux';

import app from './app';
import cart from './cart';
import catalog from './catalog';
import checkout from './checkout';
import directory from './directory';
import user from './user';
import checkoutReceipt from 'src/components/Checkout/Receipt/reducer';

export default combineReducers({
    app,
    cart,
    catalog,
    checkout,
    directory,
    user,
    checkoutReceipt
});
