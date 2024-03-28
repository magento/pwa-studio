import { combineReducers, createStore,applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';
import { enhancer, reducers } from '@magento/peregrine';

// This is the connective layer between the Peregrine store and the
// venia-concept UI. You can add your own reducers/enhancers here and combine
// them with the Peregrine exports.
//
// example:
// const rootReducer = combineReducers({ ...reducers, ...myReducers });
// const rootEnhancer = composeEnhancers(enhancer, myEnhancer);
// export default createStore(rootReducer, rootEnhancer);
const rootReducer = combineReducers(reducers);

// const composedEnhancers = compose(
//     applyMiddleware(thunk),
//     enhancer
//   );

//applyMiddleware(thunk),
export default createStore(rootReducer, enhancer);
