import useStoreConfigRequiredLogin from './useStoreConfigRequiredLogin';

export default original => {
    return function useStoreSwitcher(props, ...restArgs) {
        useStoreConfigRequiredLogin();

        // Run the original, wrapped function
        const { ...defaultResults } = original(props, ...restArgs);

        // Add the new data to the data returned by the original function
        return {
            ...defaultResults
        };
    };
};
