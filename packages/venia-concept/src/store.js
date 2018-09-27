import bootstrap from '@magento/peregrine';

import appReducer from 'src/reducers/app';
import directoryReducer from 'src/reducers/directory';

const { Provider, store } = bootstrap({
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: __webpack_public_path__
});

const { addReducer, dispatch, getState } = store;

addReducer('app', appReducer);
addReducer('directory', directoryReducer);

export { Provider, addReducer, dispatch, getState };
