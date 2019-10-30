import { combineReducers, createStore } from 'redux';
import { enhancer, reducers } from '@magento/peregrine';

export default createStore(
    combineReducers(reducers),
    enhancer
);
