import { applyMiddleware, compose, createStore } from 'redux';
import { exposeSlices } from './enhancers';
import middleware from './middleware';

const reducer = (state = {}) => state;

const initStore = () =>
    createStore(
        reducer,
        compose(
            applyMiddleware(...middleware),
            exposeSlices
        )
    );

export default initStore;
