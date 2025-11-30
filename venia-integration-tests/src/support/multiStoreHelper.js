/**
 * Helper functions for multi-store configuration checks
 */

/**
 * Check if multi-store is configured by querying availableStores
 * @returns {Cypress.Chainable<boolean>} - Returns true if multiple stores exist
 */
export const isMultiStoreConfigured = () => {
    return cy
        .request({
            method: 'POST',
            url: Cypress.config('baseUrl') + '/graphql',
            body: {
                query: `{
                availableStores {
                    store_code
                    store_name
                }
            }`
            },
            failOnStatusCode: false
        })
        .then(response => {
            if (response.status !== 200 || !response.body.data) {
                cy.log('❌ Failed to fetch availableStores');
                return false;
            }

            const stores = response.body.data.availableStores;
            const storeCount = stores ? stores.length : 0;

            cy.log(`📊 Found ${storeCount} store(s)`);

            if (storeCount > 1) {
                cy.log('✅ Multi-store IS configured');
                return true;
            } else {
                cy.log(
                    '⚠️ Multi-store NOT configured (only ' +
                        storeCount +
                        ' store)'
                );
                return false;
            }
        });
};

/**
 * Skip test if multi-store is not configured
 * Usage:
 *   beforeEach(() => {
 *       skipIfSingleStore();
 *   });
 */
export const skipIfSingleStore = () => {
    isMultiStoreConfigured().then(isConfigured => {
        if (!isConfigured) {
            cy.log('⏭️ Skipping test: Multi-store not configured');
            // @ts-ignore
            this.skip();
        }
    });
};

/**
 * Check store count and return it
 * @returns {Cypress.Chainable<number>}
 */
export const getStoreCount = () => {
    return cy
        .request({
            method: 'POST',
            url: Cypress.config('baseUrl') + '/graphql',
            body: {
                query: `{
                availableStores {
                    store_code
                    store_name
                }
            }`
            },
            failOnStatusCode: false
        })
        .then(response => {
            if (response.status !== 200 || !response.body.data) {
                return 0;
            }
            return response.body.data.availableStores?.length || 0;
        });
};
