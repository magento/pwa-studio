import { getConfigData } from '@orienteed/requestQuote/src/store';

export default original => {
    return function useAccountMenuItems(props, ...restArgs) {
        // Run the original, wrapped function
        const { ...defaultReturnData } = original(props, ...restArgs);

        const { isEnable } = getConfigData();

        if (isEnable) {
            const MY_QUOTES = {
                name: 'My Quotes',
                id: 'accountMenu.myQuotes',
                url: '/mprequestforquote/customer/quotes'
            };

            defaultReturnData.menuItems.push(MY_QUOTES);
        }

        return {
            ...defaultReturnData
        };
    };
};
