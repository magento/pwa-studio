/**
 * Utility function to hit different routes
 */
export const visitPage = routeUrl => {
    cy.visit(routeUrl);
    cy.wait(5000);
};
