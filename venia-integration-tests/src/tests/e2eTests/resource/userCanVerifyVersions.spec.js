import {
    homePage as homePageFixtures,
    resource as resourceFixtures
} from '../../../fixtures';

const { homePage } = homePageFixtures;

const { clientJs } = resourceFixtures;

beforeEach(() => {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
            });
        });
    }
});

afterEach(() => {
    window.navigator.serviceWorker.register;
});

describe('verify version banner', () => {
    it(
        'user can see list of important package versions',
        { tags: ['@e2e', '@commerce', '@open-source', '@ci'] },
        () => {
            cy.intercept('GET', clientJs).as('resourceClientJs');

            cy.visit(homePage);
            cy.wait('@resourceClientJs', {
                timeout: 20000
            })
                .its('response.body')
                .should('match', /@version pwa-studio: \d+\.\d+\.\d+/i)
                .should('match', /@magento\/pwa-buildpack: [~^]?\d+\.\d+\.\d+/i)
                .should('match', /@magento\/venia-ui: [~^]?\d+\.\d+\.\d+/i);
        }
    );
});
