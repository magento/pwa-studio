import { useCallback, useMemo } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';

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
 * @param {Object} props.history router history object
 * @returns {{
 *   handleCreateAccount: function,
 *   initialValues: object
 * }}
 */
export const useCreateAccountPage = props => {
    const [, { createAccount }] = useUserContext();
    // TODO replace with useHistory in React Router 5.1
    const { history } = props;

    const handleCreateAccount = useCallback(
        async accountInfo => {
            await createAccount(accountInfo);
            history.push('/');
        },
        [createAccount, history]
    );

    const initialValues = useMemo(
        () => getCreateAccountInitialValues(window.location.search),
        []
    );

    return {
        handleCreateAccount,
        initialValues
    };
};
