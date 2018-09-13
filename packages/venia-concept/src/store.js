import { compose, createStore } from 'redux';
import { exposeSlices } from '@magento/peregrine';

import applyMiddleware from 'src/middleware';
import appReducer from 'src/reducers/app';
import catalogReducer from 'src/reducers/catalog';
import directoryReducer from 'src/reducers/directory';

const reducer = (state = {}) => state;
const enhancer = compose(
    applyMiddleware,
    exposeSlices
);

const store = createStore(reducer, enhancer);

store.addReducer('app', appReducer);
store.addReducer('catalog', catalogReducer);
store.addReducer('directory', directoryReducer);

export default store;
