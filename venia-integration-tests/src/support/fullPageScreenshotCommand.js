/**
 * Checkout https://github.com/jaredpalmer/cypress-image-snapshot#options
 * for more image config options.
 */
const defaultOptions = {
    comparisonMethod: 'ssim',
    failureThreshold: 0.01,
    failureThresholdType: 'percent'
};

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

    cy.document().toMatchImageSnapshot({ ...defaultOptions, ...options });

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
