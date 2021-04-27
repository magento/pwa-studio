/**
 * Utility function to open the login dialog
 */
export const goToHomePage = () => {
    // visit homepage defined in cypress.config.json
    cy.visit('/');
    cy.wait(5000);
};
