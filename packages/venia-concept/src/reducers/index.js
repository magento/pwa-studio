import { combineReducers } from 'redux';

import app from './app';
import purchaseDetails from './purchaseDetails';
import cart from './cart';
import catalog from './catalog';
import checkout from './checkout';
import directory from './directory';
import user from './user';

export default combineReducers({
    app,
    purchaseDetails,
    cart,
    catalog,
    checkout,
    directory,
    user
});
