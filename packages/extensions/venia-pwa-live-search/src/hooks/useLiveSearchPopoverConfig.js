import { useQuery } from '@apollo/client';
import { GET_STORE_CONFIG_FOR_LIVE_SEARCH_POPOVER, GET_CUSTOMER_GROUP_CODE } from '../queries';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useLiveSearchPopoverConfig = () => {

    const [{ isSignedIn }] = useUserContext();

    const { data: storeData, loading: storeLoading, error: storeError } =
        useQuery(GET_STORE_CONFIG_FOR_LIVE_SEARCH_POPOVER);

    const {
        data: customerData,
        loading: customerLoading,
        error: customerError
    } = useQuery(GET_CUSTOMER_GROUP_CODE, {
        skip: !isSignedIn,
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = storeData?.storeConfig || {};
    const currency = storeData?.currency || {};
    const baseUrl = storeConfig.base_url || '';
    const baseUrlwithoutProtocol = baseUrl.replace(/^https?:/, '').replace(/\/$/, '');
    const customerGroupCode =
        isSignedIn && customerData?.customer?.group_code
            ? customerData.customer.group_code
            : 'b6589fc6ab0dc82cf12099d1c2d40ab994e8410c';

    const configReady =
        !storeLoading &&
        (!isSignedIn || !customerLoading) &&
        !storeError &&
        (!isSignedIn || !customerError) &&
        storeConfig?.ls_environment_id; // required field

    if (!configReady) {
        return {
            storeDetails: null,
            storeLoading,
            customerLoading,
            storeError,
            customerError,
            configReady: false
        };
    }

    const storeDetails = {
        environmentId: storeConfig.ls_environment_id || '',
        websiteCode: storeConfig.website_code || '',
        storeCode: storeConfig.store_group_code || '',
        storeViewCode: storeConfig.store_code || '',
        config: {
            pageSize: storeConfig.ls_page_size_default || '8',
            minQueryLength: storeConfig.ls_min_query_length || '3',
            currencySymbol:
                currency.default_display_currency_symbol || '\u0024',
            currencyCode: currency.default_display_currency_code || 'USD',
            locale: storeConfig.ls_locale || 'en_US'
        },
        context: {
            customerGroup: customerGroupCode
        },
        baseUrl,
        baseUrlwithoutProtocol
    };

    return {
        storeDetails,
        storeLoading,
        customerLoading,
        storeError,
        customerError,
        configReady
    };
};
