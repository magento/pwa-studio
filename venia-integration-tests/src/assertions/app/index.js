export const assertUrlSuffix = () => {
    cy.location()
        .its('pathname')
        .should('match', /\.html$/);
};

export const assertNoUrlSuffix = () => {
    cy.location()
        .its('pathname')
        .should('not.match', /\.html$/);
};
