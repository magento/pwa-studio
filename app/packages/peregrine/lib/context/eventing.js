import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef
} from 'react';
import { Observable } from 'zen-observable-ts';

const EVENT_NAME = 'eventing';
const EventingContext = createContext();

const EventingContextProvider = props => {
    const { children } = props;
    const cacheRef = useRef([]);

    const state = useMemo(
        () =>
            new Observable(observer => {
                for (const element of cacheRef.current) {
                    observer.next(element);
                }

                document.addEventListener(EVENT_NAME, event => {
                    observer.next(event.detail);
                });
            }),
        []
    );

    const dispatch = useCallback(detail => {
        const event = new CustomEvent(EVENT_NAME, { detail });

        cacheRef.current.push(detail);
        document.dispatchEvent(event);
    }, []);

    const contextValue = useMemo(
        () => [
            state,
            {
                dispatch,
                subscribe: state.subscribe
            }
        ],
        [dispatch, state]
    );

    return (
        <EventingContext.Provider value={contextValue}>
            {children}
        </EventingContext.Provider>
    );
};

export default EventingContextProvider;
export const useEventingContext = () => useContext(EventingContext);
