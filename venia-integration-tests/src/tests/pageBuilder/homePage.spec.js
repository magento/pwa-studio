/// <reference types="cypress" />

context('Assert Venia Home Page pagebuilder content', () => {
    describe('Assert Page Builder content', () => {
        it('should render page builder content correctly', () => {
            cy.visit('/default/venia-tops.html?page=1');

            cy.wait(3000);

            cy.captureFullPageScreenshot();
        });
    });
});
