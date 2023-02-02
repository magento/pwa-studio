import { applyMiddleware } from 'redux';

import auth from '../middleware/auth';
import log from '../middleware/log';
import thunk from '../middleware/thunk';
import restrictedAuthPage from '../middleware/restrictedAuthPage';

const middleware = [thunk, auth, restrictedAuthPage];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(log);
}

export default applyMiddleware(...middleware);
