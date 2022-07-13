import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useEffect, useState } from 'react';
import { default as handleEvent } from './handleEvent';
import useExtensionContext from './hooks/useExtensionContext';

export default original => props => {
    const [{ isSignedIn, currentUser }] = useUserContext();
    const [observable] = useEventingContext();

    const [sdk, setSdk] = useState();

    const {
        data: storefrontData,
        ready: storefrontDataReady,
        errors
    } = useExtensionContext();

    useEffect(() => {
        if (errors) {
            console.error('Experience Platform Connector Error', errors);
            return;
        }

        if (storefrontDataReady && storefrontData) {
            const {
                dataServicesStorefrontInstanceContext: storefrontContext,
                experienceConnectorContext: connectorContext
            } = storefrontData;

            import('@adobe/magento-storefront-events-sdk').then(mse => {
                if (!window.magentoStorefrontEvents) {
                    window.magentoStorefrontEvents = mse;
                }

                const orgId = storefrontContext.ims_org_id;
                const datastreamId = connectorContext.datastream_id;

                if (orgId && datastreamId) {
                    mse.context.setAEP({
                        imsOrgId: orgId,
                        datastreamId: datastreamId
                    });

                    mse.context.setEventForwarding({
                        aep: true
                    });

                    // Set storefront context
                    mse.context.setStorefrontInstance({
                        environmentId: storefrontContext.environment_id,
                        environment: storefrontContext.environment,
                        storeUrl: storefrontContext.store_url,
                        websiteId: storefrontContext.website_id,
                        websiteCode: storefrontContext.website_code,
                        storeId: storefrontContext.store_id,
                        storeCode: storefrontContext.store_code,
                        storeViewId: storefrontContext.store_view_id,
                        storeViewCode: storefrontContext.store_view_code,
                        websiteName: storefrontContext.website_name,
                        storeName: storefrontContext.store_name,
                        storeViewName: storefrontContext.store_view_name,
                        baseCurrencyCode: storefrontContext.base_currency_code,
                        storeViewCurrencyCode:
                            storefrontContext.store_view_currency_code,
                        catalogExtensionVersion:
                            storefrontContext.catalog_extension_version
                    });

                    import('@adobe/magento-storefront-event-collector').then(
                        msec => {
                            msec;
                            setSdk(mse);
                        }
                    );
                }
            });
        }
    }, [storefrontDataReady, storefrontData, setSdk, errors]);

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

                sdk.context.setAccount({
                    firstName: currentUser.firstname,
                    lastName: currentUser.lastname,
                    emailAddress: currentUser.email,
                    accountType: currentUser.__typename
                });
            } else {
                sdk.context.setShopper({
                    shopperId: 'guest'
                });
            }
        }
    }, [sdk, isSignedIn, currentUser]);

    return original(props);
};
