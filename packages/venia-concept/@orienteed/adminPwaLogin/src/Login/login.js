import { useParams, useHistory } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

const Login = () => {
    const { customer_token } = useParams();
    const history = useHistory();

    const [{}, { setToken, signOut }] = useUserContext();

    const handleSubmit = useCallback(async () => {
        await storage.removeItem('pwa_login');
        await signOut();
        await setToken(customer_token);
        await storage.setItem('pwa_login', 'true', 3600);
        history.push('/');
    });

    useEffect(() => {
        setTimeout(function() {
            handleSubmit();
        }, 1000);
    }, [handleSubmit]);

    return null;
};

export default Login;
