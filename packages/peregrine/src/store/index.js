import { applyMiddleware, compose, createStore } from 'redux';
import { exposeSlices } from './enhancers';
import { log } from './middleware';

const reducer = (state = {}) => state;

const initStore = () =>
    createStore(reducer, compose(applyMiddleware(log), exposeSlices));

export default initStore;
