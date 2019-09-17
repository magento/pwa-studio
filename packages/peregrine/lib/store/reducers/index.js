import app from './app';
import cart from './cart';
import catalog from './catalog';
import checkout from './checkout';
import directory from './directory';
import user from './user';
import purchaseDetails from './purchaseDetails';
import purchaseHistory from './purchaseHistory';

const reducers = {
    app,
    cart,
    catalog,
    checkout,
    directory,
    purchaseDetails,
    purchaseHistory,
    user
};

export default reducers;
