import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useEffect, useState } from 'react';

export default original => props => {
    const [observable] = useEventingContext();

    const [sdk, setSdk] = useState();

    useEffect(() => {
        import('@adobe/magento-storefront-events-sdk').then(mse => {
            if (!window.magentoStorefrontEvents) {
                window.magentoStorefrontEvents = mse;
            }

            // TODO: Update this once we are able to get the id values from graphql
            mse.context.setAEP({
                imsOrgId: process.env.IMS_ORG_ID,
                datastreamId: process.env.DATASTREAM_ID
            });

            mse.context.setEventForwarding({
                aep: true
            });

            import('@adobe/magento-storefront-event-collector').then(msec => {
                msec;
                setSdk(mse);
            });
        });
    }, [setSdk]);

    useEffect(() => {
        if (sdk) {
            const sub = observable.subscribe(async event => {
                // Add event handlers here
            });

            return () => {
                sub.unsubscribe();
            };
        }
    }, [sdk, observable]);

    return original(props);
};
