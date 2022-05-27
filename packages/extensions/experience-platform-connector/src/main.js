import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useEffect } from 'react';

export default original => props => {
    const [observable] = useEventingContext();

    useEffect(() => {
        const sub = observable.subscribe(async event => {
          // Add event handlers here
        });

        return () => {
            sub.unsubscribe();
        };
    },[observable]);

    return original(props);
};
