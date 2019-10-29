import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

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
    const history = useHistory();
    const { search } = useLocation();

    const handleCreateAccount = useCallback(() => {
        history.push('/');
    }, [history]);

    const initialValues = useMemo(() => getCreateAccountInitialValues(search), [
        search
    ]);

    return {
        handleCreateAccount,
        initialValues
    };
};
