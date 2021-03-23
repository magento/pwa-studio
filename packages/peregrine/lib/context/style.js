import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo
} from 'react';

const StyleContext = createContext();
const isServer = !globalThis.document;

/**
 * Client-side. Injects rulesets into a StyleSheet element, returning a single
 * cleanup function that, when called, removes all injected rulesets.
 * @param {array} styles
 * @returns {disposeAll}
 */
const insertAll = styles => {
    const removeAll = styles.map(style => style._insertCss());

    return () => {
        removeAll.forEach(dispose => dispose());
    };
};

/**
 * Server-side. Creates a callback that adds rulesets to a global Set.
 * @param {Set} initialState
 * @returns {addAll}
 */
const getAll = initialState => styles => {
    styles.forEach(style => {
        initialState.add(style._getCss());
    });
};

const StyleContextProvider = props => {
    const { children, initialState } = props;

    const api = useMemo(() => (isServer ? getAll(initialState) : insertAll), [
        initialState
    ]);

    return (
        <StyleContext.Provider value={api}>{children}</StyleContext.Provider>
    );
};

export default StyleContextProvider;

export const useStyle = (...styles) => {
    const insertCss = useContext(StyleContext);

    const runInsert = useCallback(() => {
        try {
            // TODO: maybe throw an error instead of failing silently?
            // unit tests would need to mock this hook, though
            if (insertCss) {
                insertCss(styles);
            }
        } catch (error) {
            console.error(error);
        }
    }, [insertCss, styles]);

    // React ignores effects on the server, so run this one during render
    // but ensure `initialState` is a `Set` to avoid duplicate styles
    if (isServer) {
        runInsert();
    }

    // React hooks must be run the same number of times in the same order
    // so the conditional goes inside the effect.
    useEffect(() => {
        if (!isServer) {
            runInsert();
        }
    }, [runInsert]);
};

/**
 * Removes all injected rulesets.
 * @callback disposeAll
 */

/**
 * Adds rulesets to a Set in closure.
 * @callback addAll
 */
