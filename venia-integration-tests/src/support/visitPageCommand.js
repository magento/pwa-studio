const visitPage = (routeUrl, wait = 5000) => {
    cy.visit(routeUrl);
    cy.wait(wait);
};

Cypress.Commands.add('visitPage', visitPage);
