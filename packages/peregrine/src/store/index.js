import { applyMiddleware, compose, createStore } from 'redux';
import { exposeSlices } from './enhancers';
import { log } from './middleware';

const initStore = (reducer = (state = {}) => state, middleWare) =>
    createStore(
        reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__(),
        compose(
            applyMiddleware(middleWare, log),
            exposeSlices
        )
    );

export default initStore;
