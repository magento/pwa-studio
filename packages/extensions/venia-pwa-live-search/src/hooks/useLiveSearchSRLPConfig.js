// src/hooks/useLiveSearchSRLPConfig.js
import { useQuery, useMutation } from '@apollo/client';
import { GET_STORE_CONFIG_FOR_PLP, GET_CUSTOMER_GROUP_CODE } from '../queries';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import operations from '@magento/peregrine/lib/talons/Gallery/addToCart.gql';

export const useLiveSearchSRLPConfig = () => {
  

    const {
        data: storeConfigData,
        loading: loadingStoreConfig,
        error: errorStoreConfig
    } = useQuery(GET_STORE_CONFIG_FOR_PLP);

    const { data: customerData, loading: loadingCustomer } = useQuery(
        GET_CUSTOMER_GROUP_CODE
    );

    const loading = loadingStoreConfig || loadingCustomer;
    const error = errorStoreConfig;

    // Extract store config from the response
    const storeConfig = storeConfigData?.storeConfig;
    const currency = storeConfigData?.currency;
    const baseUrl = storeConfig?.base_url || '';
    const baseUrlwithoutProtocol = baseUrl
        ?.replace(/^https?:/, '')
        .replace(/\/$/, '');
    const customerGroupCode =
        customerData?.customer?.group_code ||
        'b6589fc6ab0dc82cf12099d1c2d40ab994e8410c';

    const [{ cartId }] = useCartContext();
    const [addToCart] = useMutation(operations.ADD_ITEM);
    const [, { dispatch }] = useEventingContext();

    const config = {
        environmentId: storeConfig?.ls_environment_id || '',
        environmentType: storeConfig?.ls_environment_type || '',
        apiKey: '',
        websiteCode: storeConfig?.website_code || '',
        storeCode: storeConfig?.store_group_code || '',
        storeViewCode: storeConfig?.store_code || '',
        searchQuery: 'query',
        config: {
            pageSize: storeConfig?.ls_page_size_default || '8',
            perPageConfig: {
                pageSizeOptions:
                    storeConfig?.ls_page_size_options || '12,24,36',
                defaultPageSizeOption: storeConfig?.ls_page_size_default || '12'
            },
            minQueryLength: storeConfig?.ls_min_query_length || '3',
            currencySymbol:
                currency?.default_display_currency_symbol || '\u0024',
            currencyCode: currency?.default_display_currency_code || 'USD',
            currencyRate: '1',
            displayOutOfStock: storeConfig?.ls_display_out_of_stock || '',
            allowAllProducts: storeConfig?.ls_allow_all || '',
            locale: storeConfig?.ls_locale || 'en_US',
            resolveCartId: () => cartId,
            addToCart: async (sku, options, quantity) => {
                try {
                    await addToCart({
                        variables: {
                            cartId,
                            cartItem: {
                                quantity,
                                entered_options: options,
                                sku: sku
                            }
                        }
                    });

                    dispatch({
                        type: 'CART_ADD_ITEM',
                        payload: {
                            cartId,
                            sku: sku,
                            selectedOptions: null,
                            quantity
                        }
                    });
                } catch (error) {
                    console.error('Error adding to cart:', error);
                }
            }
        },
        context: {
            customerGroup: customerGroupCode
        },
        baseUrl,
        baseUrlwithoutProtocol
    };
    console.log('SRLP config : ', config);

    return { config, loading, error };
};
