/**
 * @description Fetches a RootComponent by type.
 *
 * At build time, `fetchRootComponent` is injected as a global.
 * Depending on the environment, this global will be either an
 * ES module with a `default` property, or a plain CJS module.
 */

const getRouteComponent = async (type, id) => {
    if (!type || !id) return;

    const fetchRoot =
        'default' in fetchRootComponent
            ? fetchRootComponent.default
            : fetchRootComponent;

    return fetchRoot(type);
};

export default getRouteComponent;
