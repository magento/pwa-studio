import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

const StaticContext = createContext();

/**
 *
 * @param {object} props
 * @param {string} props.origin
 * @param {string} props.url
 * @param {object} props.dom
 * @returns
 */
const GlobalContextProvider = props => {
    const { url, origin, dom } = props;
    const navigated = useHistoryListener();
    const client = useApolloClient();

    const contextValue = useMemo(() => {
        const fullUrl = IS_BROWSER ? globalThis.location.pathname : url;
        return {
            url: fullUrl,
            origin: IS_BROWSER ? globalThis.location.origin : origin,
            href: IS_BROWSER ? globalThis.location.href : `${origin}${fullUrl}`,
            dom: IS_BROWSER ? globalThis : dom,
            // While there was no navigation, the current root content is server rendered
            isServerContent: SSR_ENABLED ? IS_SERVER || !navigated : false,
            // disableNetworkFetches has to be set to false after hydration is complete
            isHydrated: SSR_ENABLED
                ? IS_BROWSER && !client.disableNetworkFetches
                : true
        };
    }, [client.disableNetworkFetches, dom, navigated, origin, url]);

    return (
        <StaticContext.Provider value={contextValue}>
            {props.children}
        </StaticContext.Provider>
    );
};

/**
 *
 * @returns {{origin: string, dom: window, url: string, href: string, isServerContent: boolean, isHydrated: boolean }}
 */
export const useGlobalContext = () => useContext(StaticContext);

/**
 * Hook that tells you if there has been any navigation since the app was loaded
 *
 * @returns {boolean}
 */
const useHistoryListener = () => {
    const [navigated, setNavigated] = useState(false);

    const history = useHistory();

    const handleNavigated = () => {
        setNavigated(true);
    };

    useEffect(() => {
        let unlisten;

        if (!navigated) {
            unlisten = history.listen(() => {
                handleNavigated();
            });
        }

        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, [history, navigated]);

    return navigated;
};

export default GlobalContextProvider;
