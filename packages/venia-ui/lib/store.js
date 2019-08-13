import { createStore } from 'redux';

import middleware from './lib/middleware';
import errorHandler from './lib/middleware/errorHandler';
import reducer from './lib/reducers';
import composeEnhancers from './lib/util/composeEnhancers';

export default createStore(reducer, composeEnhancers(middleware, errorHandler));
