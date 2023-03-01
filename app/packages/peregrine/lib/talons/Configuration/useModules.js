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
            this.b2bProductDetailView = Boolean(
                tenantConfig.b2b?.IS_B2B === 'true' || tenantConfig.b2b?.IS_B2B === true
            );
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
