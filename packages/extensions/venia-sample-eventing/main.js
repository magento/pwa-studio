import { useEffect } from 'react';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

export default original => props => {
    const [observable, { dispatch }] = useEventingContext();

    useEffect(() => {
        observable.subscribe(event => {
            console.log('Logging event:', event);
        });

        dispatch('hello world');
    }, [dispatch, observable]);

    return original(props);
};
