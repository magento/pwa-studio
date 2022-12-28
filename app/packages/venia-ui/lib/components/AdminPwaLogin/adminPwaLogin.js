import { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const AdminPwaLogin = () => {
    const [, { setToken, signOut }] = useUserContext();
    const history = useHistory();
    const { customer_token } = useParams();

    const handleSubmit = useCallback(async () => {
        await storage.removeItem('pwa_login');
        await signOut();
        await setToken(customer_token);
        await storage.setItem('pwa_login', 'true', 3600);
        history.push('/');
    }, [customer_token, setToken, signOut, history]);

    useEffect(() => {
        setTimeout(function() {
            handleSubmit();
        }, 1000);
    }, [handleSubmit]);

    return null;
};

export default AdminPwaLogin;
