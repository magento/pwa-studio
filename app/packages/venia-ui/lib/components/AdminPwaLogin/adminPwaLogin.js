import { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useMutation, gql } from '@apollo/client';

const AdminPwaLogin = () => {
    const [, { setToken, signOut }] = useUserContext();
    const history = useHistory();
    const { customer_token } = useParams();

    const [, { createCart }] = useCartContext();
    const [fetchCartId] = useMutation(CREATE_CART);

    const handleSubmit = useCallback(async () => {
        await storage.removeItem('pwa_login');
        await signOut();
        await setToken(customer_token);
        await createCart({
            fetchCartId
        });
        await storage.setItem('pwa_login', 'true', 3600);
        history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer_token, setToken, signOut, history, createCart]);

    useEffect(() => {
        setTimeout(function() {
            handleSubmit();
        }, 1000);
    }, [handleSubmit]);

    return null;
};

export default AdminPwaLogin;

const CREATE_CART = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;
