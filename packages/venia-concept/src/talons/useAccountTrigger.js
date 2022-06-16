import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

export default original => {
    return function useAccountTrigger(props, ...restArgs) {
        const history = useHistory();

        // Run the original, wrapped function
        let { ...defaultReturnData } = original(props, ...restArgs);

        const { setAccountMenuIsOpen } = defaultReturnData;

        const handleTriggerClick = useCallback(() => {
            const signin_token = storage.getItem('signin_token');
            if (signin_token != undefined) {
                setAccountMenuIsOpen(true);
            } else {
                history.push('/sign-in');
            }
        }, [setAccountMenuIsOpen]);

        // Add the new data to the data returned by the original function
        return {
            ...defaultReturnData,
            handleTriggerClick
        };
    };
};
