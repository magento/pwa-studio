import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

const restrictedAuthPage = store => next => action => {
    const unAuthPath = ['sign-in', 'create-account', 'forgot-password', 'customer/account/createPassword'];
    const currentPath = window.location.pathname;
    const signin_token = storage.getItem('signin_token');
    const storeConfigRequiredLogin = storage.getItem('is_required_login');

    if (!signin_token && storeConfigRequiredLogin === '1') {
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
