import { compose } from 'redux';

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    globalThis.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? globalThis.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

export default composeEnhancers;
