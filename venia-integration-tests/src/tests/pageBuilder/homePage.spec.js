/// <reference types="cypress" />

context('Assert Venia Home Page pagebuilder content', () => {
    describe('Assert Page Builder content', () => {
        it('should render page builder content correctly', () => {
            cy.viewport(800, 500);

            cy.wait(500);

            cy.visit('/');

            cy.wait(3000);

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Home Page'
                });
            });
        });
    });
});
