import {
    categorySweaters,
    productCarinaCardigan
} from '../../../fixtures/categoryPage/index';

import { homePage } from '../../../fixtures/homePage/index';

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify pagebuilder banner content', () => {
    it('verify banner content', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page',
                timeout: 60000
            });
        });
    });
    it('verify banner content2', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner2.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page2',
                timeout: 60000
            });
        });
    });

    it('verify banner content3', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner3.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page3',
                timeout: 60000
            });
        });
    });

    it('verify banner content4', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner4.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page4',
                timeout: 60000
            });
        });
    });

    it('verify banner content5', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner5.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page5',
                timeout: 60000
            });
        });
    });

    it('verify banner content6', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner6.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page6',
                timeout: 60000
            });
        });
    });

    it('verify banner content7', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner7.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page7',
                timeout: 60000
            });
        });
    });

    it('verify banner content8', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner8.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page8',
                timeout: 60000
            });
        });
    });

    it('verify banner content9', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner9.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(5000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page9',
                timeout: 60000
            });
        });
    });

    it('verify banner content10', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/banner/banner10.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.wait(10000);
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Home Page10',
                timeout: 180000
            });
        });
    });
});
