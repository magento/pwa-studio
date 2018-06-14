import { applyMiddleware, compose, createStore } from 'redux';
import { exposeSlices } from './enhancers'
import { log } from './middleware';
import thunk from 'redux-thunk';

const initStore = (reducer = ((state = {}) => state)) =>
    createStore(
        reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        compose(
            applyMiddleware(thunk, log),
            exposeSlices
        )
    );

export default initStore;