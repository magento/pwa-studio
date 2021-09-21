export const getComponentData = routeData => {
    const excludedKeys = ['redirect_code', 'relative_url'];

    return Object.fromEntries(
        Object.entries(routeData).filter(([key]) => {
            return !excludedKeys.includes(key);
        })
    );
};
