import { applyMiddleware, createStore } from 'redux';
import { exposeSlices } from './enhancers';
import composeEnhancers from './composeEnhancers';
import middleware from './middleware';

const reducer = (state = {}) => state;

const initStore = () =>
    createStore(
        reducer,
        composeEnhancers(applyMiddleware(...middleware), exposeSlices)
    );

export default initStore;
