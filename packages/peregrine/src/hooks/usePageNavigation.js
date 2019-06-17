import { useCallback, useEffect } from 'react';

const dispatchRouteChangeEvent = () => {
    document.dispatchEvent(new Event('ROUTE_CHANGE'), {
        bubbles: true,
        cancelable: false
    });
};

const usePageNavigation = onRouteChange => {
    const route = document.location.pathname;
    const setRoute = useCallback(route => {
        onRouteChange && onRouteChange(route);
        dispatchRouteChangeEvent(route);
    }, []);
    useEffect(() => {
        subscribeToRouteChange(onRouteChange);
    }, []);
    useEffect(() => {
        setRoute(route);
    }, [route]);
    return [route, setRoute];
};

export default usePageNavigation;
