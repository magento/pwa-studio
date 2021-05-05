const captureFullPageScreenshot = options => {
    /**
     * Set the header position to static instead
     * of sticky to not let it follow while taking
     * the whole page screenshot.
     */
    cy.get('[class^="header-closed-"]').invoke(
        'attr',
        'style',
        'position: static'
    );

    cy.document().toMatchImageSnapshot(options);

    /**
     * Reset the position attribute to default
     */
    cy.get('[class^="header-closed-"]').invoke(
        'attr',
        'style',
        'position: sticky'
    );
};

Cypress.Commands.add('captureFullPageScreenshot', captureFullPageScreenshot);
