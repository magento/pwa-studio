import { useCallback, useState } from 'react';
import getTenantConfig from '../../RestApi/Configuration/getTenantConfig';

export const useModules = () => {
    const [tenantConfig, setTenantConfig] = useState({});
    const [error, setError] = useState(null);

    class TenantConfig {
        constructor(tenantConfig) {
            this.lmsEnabled = Boolean(tenantConfig.lms?.ENABLED === 'true' || tenantConfig.lms?.ENABLED === true);
            this.csrEnabled = Boolean(tenantConfig.csr?.ENABLED === 'true' || tenantConfig.csr?.ENABLED === true);
            this.chatbotEnabled = Boolean(tenantConfig.chatbot?.ENABLED === 'true' || tenantConfig.chatbot?.ENABLED === true);
            this.braintreeToken = tenantConfig.braintree?.CHECKOUT_BRAINTREE_TOKEN;
            this.googleAnalyticsTrackingId = tenantConfig.googleAnalytics?.GOOGLE_ANALYTICS_TRACKING_ID;
            this.b2bProductDetailView = Boolean(tenantConfig.b2b?.IS_B2B === 'true' || tenantConfig.b2b?.IS_B2B === true);
            this.GoogleMapApiKey = tenantConfig.googleMap?.GOOGLE_MAPS_API_KEY;

            this.backendTechnology = tenantConfig.backendTechnology?.BACKEND_TECHNOLOGY;
            this.bigcommerceChannelId = tenantConfig.backendTechnology?.BIGCOMMERCE_CHANNEL_ID;
            
            this.downloadCsv = Boolean(tenantConfig.features?.DOWNLOAD_CSV === 'true' || tenantConfig.features?.DOWNLOAD_CSV === true);
            this.quickCart = Boolean(tenantConfig.features?.QUICK_CART === 'true' || tenantConfig.features?.QUICK_CART === true);
            this.requestForQuote = Boolean(tenantConfig.features?.REQUEST_FOR_QUOTE === 'true' || tenantConfig.features?.REQUEST_FOR_QUOTE === true);
            this.stockVisibility = Boolean(tenantConfig.features?.STOCK_VISIBILITY === 'true' || tenantConfig.features?.STOCK_VISIBILITY === true);
            this.addToCartFromSearch = Boolean(tenantConfig.features?.ADD_TO_CART_FROM_SEARCH === 'true' || tenantConfig.features?.ADD_TO_CART_FROM_SEARCH === true);
            this.productComparator = Boolean(tenantConfig.features?.PRODUCT_COMPARATOR === 'true' || tenantConfig.features?.PRODUCT_COMPARATOR === true);
            this.printPdfOfTheCart = Boolean(tenantConfig.features?.PRINT_PDF_OF_THE_CART === 'true' || tenantConfig.features?.PRINT_PDF_OF_THE_CART === true);
        }
    }

    function applyDefaultTenantConfig() {
        const enabledModulesObj = {
            lms: {
                ENABLED: process.env.LMS_ENABLED
            },
            csr: {
                ENABLED: process.env.CSR_ENABLED
            },
            chatbot: {
                ENABLED: process.env.CHATBOT_ENABLED
            },
            braintree: {
                CHECKOUT_BRAINTREE_TOKEN: process.env.CHECKOUT_BRAINTREE_TOKEN
            },
            googleAnalytics: {
                GOOGLE_ANALYTICS_TRACKING_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID
            },
            b2b: {
                IS_B2B: process.env.IS_B2B
            },
            googleMap:{
                GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
            },
            backendTechnology: {
                BACKEND_TECHNOLOGY: process.env.BACKEND_TECHNOLOGY
            },
            bigcommerceChannelId: {
                BIGCOMMERCE_CHANNEL_ID: process.env.BIGCOMMERCE_CHANNEL_ID
            },
            downloadCsv: {
                DOWNLOAD_CSV: process.env.DOWNLOAD_CSV
            },
            quickCart: {
                QUICK_CART: process.env.QUICK_CART
            },
            requestForQuote: {
                REQUEST_FOR_QUOTE: process.env.REQUEST_FOR_QUOTE
            },
            stockVisibility: {
                STOCK_VISIBILITY: process.env.STOCK_VISIBILITY
            },
            addToCartFromSearch: {
                ADD_TO_CART_FROM_SEARCH: process.env.ADD_TO_CART_FROM_SEARCH
            },
            productComparator: {
                PRODUCT_COMPARATOR: process.env.PRODUCT_COMPARATOR
            },
            printPdfOfTheCart: {
                PRINT_PDF_OF_THE_CART: process.env.PRINT_PDF_OF_THE_CART
            }
        };

            return enabledModulesObj;
    }

    const fetchTenantConfig = useCallback(
        async function() {
            if (process.env.MULTITENANT_ENABLED === 'true') {
                try {
                    const tenantConfig = await getTenantConfig();
                    const tenantConfigObj = new TenantConfig(tenantConfig?.env);
                    setTenantConfig(tenantConfigObj);
                } catch (err) {
                    setError(err);
                }
            } else {
                const defaultTenantConfig = applyDefaultTenantConfig();
                const defaultTenantConfigObj = new TenantConfig(defaultTenantConfig);
                setTenantConfig(defaultTenantConfigObj);
            }
        },
        [setError]
    );

    return {
        tenantConfig,
        fetchTenantConfig
    };
};
