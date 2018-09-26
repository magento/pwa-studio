import bootstrap, { MagentoRouter } from '@magento/peregrine';

import Loader from 'src/components/Loader';
import NotFound from 'src/components/NotFound';
import appReducer from 'src/reducers/app';
import directoryReducer from 'src/reducers/directory';

const customRouterProps = {
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: __webpack_public_path__,
    CustomLoader: Loader,
    NotFoundComponent: NotFound
};

const router = MagentoRouter;

const { Provider, store } = bootstrap({
    CustomRouter: router,
    customRouterProps: customRouterProps
});

const { addReducer, dispatch, getState } = store;

addReducer('app', appReducer);
addReducer('directory', directoryReducer);

export { Provider, addReducer, dispatch, getState };
