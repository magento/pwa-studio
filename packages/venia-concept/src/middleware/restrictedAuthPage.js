import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();
import { useStoreConfigData } from '../talons/useStoreConfigData';

const restrictedAuthPage = store => next => action => {
    const unAuthPath = ['sign-in', 'create-account', 'forgot-password'];
    const currentPath = window.location.pathname;
    const signin_token = storage.getItem('signin_token');

    const storeConfigRequiredLogin = storage;
    console.log('storeConfigRequiredLogin', storeConfigRequiredLogin);
    if (!signin_token) {
        let found = false;
        unAuthPath.forEach(value => {
            if (currentPath.indexOf(value) > -1) {
                found = true;
            }
        });

        if (!found) {
            history.pushState({}, '', '/sign-in');
            history.go(0);
        }
    }

    return next(action);
};

export default restrictedAuthPage;
