import { useEffect } from 'react';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

export default original => props => {
    const [observable, { dispatch }] = useEventingContext();

    useEffect(() => {
        const sub = observable.subscribe(event => {
            console.log('Logging event:', event);
        });

        dispatch('hello world');

        return () => {
            sub.unsubscribe();
        };
    }, [dispatch, observable]);

    return original(props);
};
