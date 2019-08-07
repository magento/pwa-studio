import { createStore } from 'redux';

import middleware from './middleware';
import errorHandler from './middleware/errorHandler';
import reducer from './reducers';
import composeEnhancers from './util/composeEnhancers';

export default createStore(reducer, composeEnhancers(middleware, errorHandler));
