import app from './app';
import cart from './cart';
import catalog from './catalog';
import checkout from './checkout';
import user from './user';
import purchaseDetails from './purchaseDetails';
import purchaseHistory from './purchaseHistory';

const reducers = {
    app,
    cart,
    catalog,
    checkout,
    purchaseDetails,
    purchaseHistory,
    user
};

export default reducers;
