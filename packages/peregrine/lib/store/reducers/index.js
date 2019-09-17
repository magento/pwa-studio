import app from './app';
import cart from './cart';
import catalog from './catalog';
import checkout from './checkout';
import user from './user';
import purchaseDetails from './purchaseDetails';
import checkoutReceipt from './checkoutReceipt';
import purchaseHistory from './purchaseHistory';

const reducers = {
    app,
    cart,
    catalog,
    checkout,
    checkoutReceipt,
    purchaseDetails,
    purchaseHistory,
    user
};

export default reducers;
