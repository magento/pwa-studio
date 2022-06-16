export default original => {
    return function useAccountMenuItems(props, ...restArgs) {
        // Run the original, wrapped function
        const { ...defaultReturnData } = original(props, ...restArgs);

        const LMS_MODULE = {
            name: 'Learning',
            id: 'accountMenu.learningLink',
            url: '/learning'
        };

        defaultReturnData.menuItems.push(LMS_MODULE);

        return {
            ...defaultReturnData
        };
    };
};
