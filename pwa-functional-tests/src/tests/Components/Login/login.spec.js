describe('testing login component of the login page', () => {
    it('test', () => {
        cy.visit('/');

        cy.wait(5000);

        // open the signin dialog
        cy.get('button[class^="accountTrigger-trigger-"]').click();
        // check if the title is rendered
        cy.get('h2[class^="signIn-title-"]').should('be.visible');
    });
});
