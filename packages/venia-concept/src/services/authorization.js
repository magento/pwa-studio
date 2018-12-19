import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;

const storage = new BrowserPersistence();

const TOKEN_STORAGE_KEY = 'signin_token';

const setAuthorizationToken = token => {
    // TODO: Get correct token expire time from API
    storage.setItem(TOKEN_STORAGE_KEY, token, 3600);
};

const getAuthorizationToken = () => storage.getItem(TOKEN_STORAGE_KEY);

const isSignedIn = () => Boolean(getAuthorizationToken());

const appendTokenToHeaders = headers => {
    const token = getAuthorizationToken();

    return {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ''
    };
};

export default {
    setAuthorizationToken,
    getAuthorizationToken,
    isSignedIn,
    appendTokenToHeaders
};
