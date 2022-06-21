import { applyMiddleware } from 'redux';

import auth from '@magento/peregrine/lib/store/middleware/auth';
import log from '@magento/peregrine/lib/store/middleware/log';
import thunk from '@magento/peregrine/lib/store/middleware/thunk';
import restrictedAuthPage from '../middleware/restrictedAuthPage';

const middleware = [thunk, auth, restrictedAuthPage];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(log);
}

export default applyMiddleware(...middleware);
