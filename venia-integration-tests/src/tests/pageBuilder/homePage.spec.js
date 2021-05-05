/// <reference types="cypress" />

context('Assert Venia Home Page pagebuilder content', () => {
    describe('Assert Page Builder content', () => {
        it('should render page builder content correctly', () => {
            cy.visit('/');

            cy.wait(3000);

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    scale: false
                });
            });
        });
    });
});
