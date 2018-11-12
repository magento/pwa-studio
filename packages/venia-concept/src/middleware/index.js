import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import log from './log';

const middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(log);
}

export default applyMiddleware(...middleware);
