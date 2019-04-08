import { createStore } from 'redux';

import middleware from '@magento/venia-library/esm/middleware';
import errorHandler from '@magento/venia-library/esm/middleware/errorHandler';
import reducer from '@magento/venia-library/esm/reducers';
import composeEnhancers from '@magento/venia-library/esm/util/composeEnhancers';

export default createStore(reducer, composeEnhancers(middleware, errorHandler));
