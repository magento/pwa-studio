import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useEffect, useState } from 'react';
import { default as handleEvent } from './handleEvent';

export default original => props => {
    const [{ isSignedIn }] = useUserContext();
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
                handleEvent(sdk, event);
            });

            return () => {
                sub.unsubscribe();
            };
        }
    }, [sdk, observable]);

    // Sets shopper context on initial load (when shopper context is null)
    useEffect(() => {
        if (sdk && !sdk.context.getShopper()) {
            if (isSignedIn) {
                sdk.context.setShopper({
                    shopperId: 'logged-in'
                });
            } else {
                sdk.context.setShopper({
                    shopperId: 'guest'
                });
            }
        }
    }, [sdk, isSignedIn]);

    return original(props);
};
