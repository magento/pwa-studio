import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();
const unAuthPath = [
    'sign-in',
    'create-account',
    'forgot-password',
    'create-account-be-customer',
    'create-account-non-customer',
    'customer/account/createPassword'
];

const restrictedAuthPage = store => next => action => {
    const currentPath = window.location.pathname;

    let storeConfigRequiredLogin = storage.getItem('is_required_login');

    if (!storeConfigRequiredLogin) {
        return next(action);
    }

    const signin_token = storage.getItem('signin_token');

    if (signin_token == undefined) {
        let found = false;
        unAuthPath.forEach(function(value) {
            if (currentPath.indexOf(value) > -1) {
                found = true;
            }
        });

        if (!found) {
            history.pushState({}, '', '/sign-in');
            history.go(0);
        }
    } else {
        let found = false;
        unAuthPath.forEach(function(value) {
            if (currentPath.indexOf(value) > -1) {
                found = true;
            }
        });

        if (found) {
            history.pushState({}, '', '/');
            history.go(0);
        }
    }

    return next(action);
};

export default restrictedAuthPage;
