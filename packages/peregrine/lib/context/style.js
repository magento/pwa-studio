import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import mergeClasses from '@magento/peregrine/lib/util/shallowMerge';

const StyleContext = createContext();
const isServer = !globalThis.document;

/**
 * Client-side. Injects rulesets into a StyleSheet element, returning a cleanup
 * function that can remove the rulesets.
 *
 * @param {object} cssModule
 */
const insertModule = cssModule => {
    if (typeof cssModule._insertCss === 'function') {
        cssModule._insertCss();
    }
};

/**
 * Server-side. Creates a callback that adds rulesets to a global Set.
 *
 * @param {Set} initialState
 */
const addModule = initialState => cssModule => {
    if (typeof cssModule._getCss === 'function') {
        initialState.add(cssModule._getCss());
    }
};

const StyleContextProvider = props => {
    const { children, initialState } = props;

    const api = useMemo(
        () => (isServer ? addModule(initialState) : insertModule),
        [initialState]
    );

    return (
        <StyleContext.Provider value={api}>{children}</StyleContext.Provider>
    );
};

export default StyleContextProvider;

export const useStyle = (cssModule, ...overrides) => {
    const insertCss = useContext(StyleContext);
    const [classes, setClasses] = useState(() =>
        mergeClasses(cssModule, ...overrides)
    );

    // this effect always runs, since rest args are always a new array
    useEffect(() => {
        // even the override objects are not memoized, typically
        // so it's easiest to just merge again
        const nextClasses = mergeClasses(cssModule, ...overrides);

        // and then compare the results to see if anything changed
        if (hasChanged(classes, nextClasses)) {
            // and then update if something did change
            setClasses(nextClasses);
        }
    }, [classes, cssModule, overrides]);

    // only recreate the callback when the classes have changed
    const runInsert = useCallback(() => {
        try {
            // TODO: maybe throw an error instead of failing silently?
            // unit tests would need to mock this hook, though
            if (insertCss) {
                insertCss(classes);
            }
        } catch (error) {
            console.error('could not insert css:', classes);
        }
    }, [classes, insertCss]);

    // only run the effect when the callback has been recreated
    useEffect(() => {
        // React hooks must run the same number of times and in the same order
        // so any conditionals belong inside the effect
        if (!isServer) {
            runInsert();
        }
    }, [runInsert]);

    // React ignores effects on the server, so run this one during render
    // even though it's an antipattern on the client
    if (isServer) {
        runInsert();
    }

    return classes;
};

function hasChanged(prev, next) {
    const prevEntries = Object.entries(prev);
    const nextEntries = Object.entries(next);
    const count = Math.max(prevEntries.length, nextEntries.length);
    let hasChanged = false;

    if (prevEntries.length !== nextEntries.length) {
        return true;
    }

    for (let index = 0; index < count; index++) {
        const [prevKey, prevValue] = prevEntries[index];
        const [nextKey, nextValue] = nextEntries[index];

        if (prevKey !== nextKey || prevValue !== nextValue) {
            hasChanged = true;
            break;
        }
    }

    return hasChanged;
}
