import { useCallback, useMemo } from 'react';
<<<<<<< HEAD
=======
import { useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';
>>>>>>> 02f23365... Fix tests

const validCreateAccountParams = ['email', 'firstName', 'lastName'];

const getCreateAccountInitialValues = search => {
    const params = new URLSearchParams(search);

    return validCreateAccountParams.reduce(
        (values, param) => ({ ...values, [param]: params.get(param) }),
        {}
    );
};

/**
 * Returns props necessary to render CreateAccountPage component.
 *
 * @returns {{
 *   handleCreateAccount: function,
 *   initialValues: object
 * }}
 */
export const useCreateAccountPage = () => {
    const [, { createAccount }] = useUserContext();
    const history = useHistory();

    const handleCreateAccount = useCallback(() => {
        history.push('/');
    }, [history]);

    const initialValues = useMemo(
        () => getCreateAccountInitialValues(window.location.search),
        []
    );

    return {
        handleCreateAccount,
        initialValues
    };
};
