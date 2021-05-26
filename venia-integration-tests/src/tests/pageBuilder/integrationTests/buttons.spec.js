describe('verify pagebuilder buttons content is rendered correctly', () => {
    it('verify buttons content', () => {
        cy.intercept('GET', '**/graphql?query=query+GetCmsPage*', {
            fixture: 'pageBuilder/buttons/buttons.json'
        }).as('getCMSMockData');
        cy.visit('/');
        cy.wait(['@getCMSMockData']).its('response.body');
        cy.loadFullPage().then(() => {
            cy.captureFullPageScreenshot({
                name: 'Page Builder Buttons Page',
                timeout: 60000
            });
        });
    });
});
