import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import auth from '../middleware/auth';
import log from '../middleware/log';

const middleware = [thunk, auth];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(log);
}

export default applyMiddleware(...middleware);
