import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState
} from 'react';

const HeaderContext = createContext();

const HeaderProvider = props => {
    const headerRef = useRef();

    const [headerState, setHeaderState] = useState({ headerRef });
    const updateHeaderState = useCallback(
        newState => {
            setHeaderState({
                ...headerState,
                ...newState
            });
        },
        [headerState]
    );
    const headerApi = useMemo(() => {
        return { updateHeaderState };
    }, [updateHeaderState]);

    const contextValue = useMemo(() => [headerState, headerApi], [
        headerApi,
        headerState
    ]);

    return (
        <HeaderContext.Provider value={contextValue}>
            {props.children}
        </HeaderContext.Provider>
    );
};

export default HeaderProvider;

export const useHeaderContext = () => useContext(HeaderContext);
