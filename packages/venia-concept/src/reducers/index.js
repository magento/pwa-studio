import { combineReducers } from 'redux';

import app from './app';
import cart from './cart';
import catalog from './catalog';
import checkout from './checkout';
import directory from './directory';
import user from './user';
import purchaseDetails from './purchaseDetails';

export default combineReducers({
    app,
    cart,
    catalog,
    checkout,
    directory,
    user,
    purchaseDetails
});
