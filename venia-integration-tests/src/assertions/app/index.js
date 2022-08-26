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

export const assertUrlContains = urlString => {
    cy.url().should('contain', urlString);
};

export const assertUrlDoesNotContains = urlString => {
    cy.url().should('not.contain', urlString);
};
