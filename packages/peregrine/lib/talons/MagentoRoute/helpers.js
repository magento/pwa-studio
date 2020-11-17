// 301 is permanent; 302 is temporary.
const REDIRECT_CODES = new Set().add(301).add(302);
export const isRedirect = code => REDIRECT_CODES.has(code);

// Webpack injects `fetchRootComponent` as a global during the build.
// Depending on the environment, it may be a CommonJS or ES module.
const warning = () => new Error('fetchRootComponent is not defined');
const { fetchRootComponent = warning } = window || {};
export const getRootComponent =
    fetchRootComponent.default || fetchRootComponent;

export const RESPONSES = {
    ERROR: routeError => ({ hasError: true, routeError }),
    FOUND: component => component,
    LOADING: { isLoading: true },
    NOT_FOUND: { isNotFound: true },
    REDIRECT: relativeUrl => ({ isRedirect: true, relativeUrl })
};
