/**
 * Utility function to hit app homepage
 */
export const goToHomePage = () => {
    // visit homepage defined in cypress.config.json
    cy.visit('/');
    cy.wait(5000);
};

/**
 * Utility function to hit different routes
 */
export const visitPage = (routeUrl) => {
    // visit homepage defined in cypress.config.json
    cy.visit(routeUrl);
    cy.wait(5000);
};