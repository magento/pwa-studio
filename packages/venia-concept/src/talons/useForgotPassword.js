import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export default original => {
    return function useForgotPassword(props, ...restArgs) {
        const history = useHistory();

        // Run the original, wrapped function
        let { ...defaultReturnData } = original(props, ...restArgs);

        const handleCancel = useCallback(() => {
            history.push('/sign-in');
        }, []);

        // Add the new data to the data returned by the original function
        return {
            ...defaultReturnData,
            handleCancel
        };
    };
};
