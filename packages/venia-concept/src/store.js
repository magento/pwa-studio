import { combineReducers, createStore } from 'redux';

// import middleware from '@magento/venia-ui/lib/middleware';
// import errorHandler from '@magento/venia-ui/lib/middleware/errorHandler';
// import reducer from '@magento/venia-ui/lib/reducers';
// import composeEnhancers from '@magento/venia-ui/lib/util/composeEnhancers';

import { enhancer, reducers } from '@magento/peregrine';

const rootReducer = combineReducers(reducers);

export default createStore(rootReducer, enhancer);
