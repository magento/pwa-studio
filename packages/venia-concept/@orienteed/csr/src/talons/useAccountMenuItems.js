export default original => {
    return function useAccountMenuItems(props, ...restArgs) {
        // Run the original, wrapped function
        const { ...defaultReturnData } = original(props, ...restArgs);

        const CSR_MODULE = {
            name: 'Support',
            id: 'accountMenu.supportLink',
            url: '/support'
        };

        defaultReturnData.menuItems.push(CSR_MODULE);

        return {
            ...defaultReturnData
        };
    };
};
