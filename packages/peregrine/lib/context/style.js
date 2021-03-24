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
const insertModule = cssModule => cssModule._insertCss();

/**
 * Server-side. Creates a callback that adds rulesets to a global Set.
 *
 * @param {Set} initialState
 */
const addModule = initialState => cssModule => {
    initialState.add(cssModule._getCss());
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

export const useStyle = (...args) => {
    // `args` will always be a new array, even if the elements haven't changed
    // so put them in a set and avoid changing that set if possible
    const [modules, setModules] = useState(() => new Set(args));
    const insertCss = useContext(StyleContext);

    // only update the set when elements have changed
    useEffect(() => {
        if (
            args.length !== modules.size ||
            args.some(item => !modules.has(item))
        ) {
            setModules(new Set(args));
        }
    }, [args, modules, setModules]);

    // only merge classes if the set has changed
    const mergedModule = useMemo(() => mergeClasses(...modules), [modules]);

    // only recreate the callback when the classes have been merged
    const runInsert = useCallback(() => {
        try {
            // TODO: maybe throw an error instead of failing silently?
            // unit tests would need to mock this hook, though
            if (insertCss) {
                insertCss(mergedModule);
            }
        } catch (error) {
            console.error(error);
        }
    }, [insertCss, mergedModule]);

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

    return mergedModule;
};
