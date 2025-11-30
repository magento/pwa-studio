/**
 * Demo test showing how to skip multi-store tests when only 1 store is configured
 */

import { getStoreCount } from '../../../support/multiStoreHelper';

describe(
    'DEMO: Multi-Store Configuration Check',
    { tags: ['@demo', '@multistore'] },
    () => {
        let storeCount = 0;

        before(() => {
            // Check store count before running any tests
            getStoreCount().then((count) => {
                storeCount = count;
                cy.log(`📊 Detected ${storeCount} store(s) in the system`);
            });
        });

        it('Demo Test 1: Should SKIP if single store', function() {
            cy.log(`Current store count: ${storeCount}`);
            
            if (storeCount <= 1) {
                cy.log('⏭️ SKIPPED: This test requires multi-store configuration');
                cy.log(`⏭️ Only ${storeCount} store(s) found, need at least 2`);
                this.skip();
                return;
            }

            cy.log('✅ Multi-store IS configured!');
            cy.log('✅ This test will run normally');
            
            // Your test code here...
            cy.visitHomePage();
            expect(storeCount).to.be.greaterThan(1);
        });

        it('Demo Test 2: Should ALWAYS run (no skip)', function() {
            cy.log('✅ This test runs regardless of store count');
            cy.log(`📊 Current store count: ${storeCount}`);
            
            // This test doesn't require multi-store, so it always runs
            cy.visitHomePage();
            expect(true).to.be.true;
        });

        it('Demo Test 3: Should SKIP if single store', function() {
            if (storeCount <= 1) {
                cy.log('⏭️ SKIPPED: Multi-store required');
                this.skip();
                return;
            }

            cy.log('✅ Running multi-store test');
            // Multi-store test code here...
        });
    }
);

