import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import * as middleware from './middleware';

const initStore = () =>
    createStore(rootReducer, applyMiddleware(...Object.values(middleware)));

export default initStore;
