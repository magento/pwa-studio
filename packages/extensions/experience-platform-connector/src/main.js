import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useEffect, useState } from 'react';
import { default as handleEvent } from './handleEvent';
import useStorefrontInstanceContext from './hooks/useStorefrontInstanceContext';

export default original => props => {
    const [{ isSignedIn }] = useUserContext();
    const [observable] = useEventingContext();

    const [sdk, setSdk] = useState();

    const {
        data: storefrontData,
        ready: storefrontDataReady
    } = useStorefrontInstanceContext();

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

    // Set the storefront context
    useEffect(() => {
        if (sdk && storefrontDataReady) {
            const { storeConfig: storefront } = storefrontData;
            const storefrontContext = {
                storeCode: storefront.store_code,
                storeName: storefront.store_name,
                storeUrl: storefront.base_url,
                storeViewCode: storefront.store_group_code,
                storeViewName: storefront.store_group_name,
                websiteCode: storefront.website_code,
                websiteName: storefront.website_name,
                baseCurrencyCode: storefront.base_currency_code,
                storeViewCurrencyCode: storefront.base_currency_code
            };

            sdk.context.setStorefrontInstance(storefrontContext);
        }
    }, [sdk, storefrontData, storefrontDataReady]);

    return original(props);
};
