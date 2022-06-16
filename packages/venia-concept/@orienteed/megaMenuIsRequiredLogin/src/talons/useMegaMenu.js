import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

export default original => {
    return function useMegaMenu(props, ...restArgs) {
        // Run the original, wrapped function
        let { ...defaultReturnData } = original(props, ...restArgs);

        const signin_token = storage.getItem('signin_token');
        const isRequiredLogin = storage.getItem('is_required_login');

        if (signin_token == undefined && isRequiredLogin) {
            defaultReturnData.megaMenuData = {};
        }

        return {
            ...defaultReturnData
        };
    };
};
