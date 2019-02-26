import { createStore } from 'redux';

import middleware from 'src/middleware';
import errorHandler from 'src/middleware/errorHandler';
import reducer from 'src/reducers';
import composeEnhancers from 'src/util/composeEnhancers';

export default createStore(reducer, composeEnhancers(middleware, errorHandler));
