const CODE_PERMANENT_REDIRECT = 301;
const CODE_TEMPORARY_REDIRECT = 302;
export const REDIRECT_CODES = new Set()
    .add(CODE_PERMANENT_REDIRECT)
    .add(CODE_TEMPORARY_REDIRECT);

export const RESPONSES = {
    ERROR: routeError => ({ hasError: true, routeError }),
    FOUND: (component, id, type) => ({ component, id, type }),
    LOADING: { isLoading: true },
    NOT_FOUND: { isNotFound: true },
    REDIRECT: relativeUrl => ({ isRedirect: true, relativeUrl })
};

export const getRouteKey = (pathname, store) => `[${store}]--${pathname}`;

const noop = () => {};
const { fetchRootComponent = noop } = window || {};
export const getRootComponent =
    fetchRootComponent.default || fetchRootComponent;
