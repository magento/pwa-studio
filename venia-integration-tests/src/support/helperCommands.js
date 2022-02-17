/**
 * Wrap iframe content
 * {@link https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/}
 */
const getIframeBody = iframe => {
    // get the iframe > document > body
    // and retry until the body element is not empty
    return (
        cy
            .get(iframe)
            .its('0.contentDocument.body')
            .should('not.be.empty')
            // wraps "body" DOM element to allow
            // chaining more Cypress commands, like ".find(...)"
            // https://on.cypress.io/wrap
            .then(cy.wrap)
    );
};

const checkUrlPath = path => {
    return cy.url().should('include', path);
};

Cypress.Commands.add('getIframeBody', getIframeBody);
Cypress.Commands.add('checkUrlPath', checkUrlPath);
