const CODE_PERMANENT_REDIRECT = 301;
const CODE_TEMPORARY_REDIRECT = 302;
export const REDIRECT_CODES = new Set()
    .add(CODE_PERMANENT_REDIRECT)
    .add(CODE_TEMPORARY_REDIRECT);

export const RESPONSES = {
    ERROR: routeError => ({ hasError: true, routeError }),
    FOUND: component => component,
    LOADING: { isLoading: true },
    NOT_FOUND: { isNotFound: true },
    REDIRECT: relativeUrl => ({ isRedirect: true, relativeUrl })
};

export const getRouteKey = (pathname, store) => `[${store}]--${pathname}`;

const warning = () => new Error('fetchRootComponent is not defined');
const { fetchRootComponent = warning } = window || {};
export const getRootComponent =
    fetchRootComponent.default || fetchRootComponent;
