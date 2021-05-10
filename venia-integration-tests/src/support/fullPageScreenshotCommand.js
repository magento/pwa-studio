/**
 * Checkout https://github.com/jaredpalmer/cypress-image-snapshot#options
 * for more image config options.
 */
const defaultOptions = {
    comparisonMethod: 'ssim',
    failureThreshold: 0.01,
    failureThresholdType: 'percent'
};

const captureFullPageScreenshot = (options = {}) => {
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

    const { name } = options;

    if (name) {
        const normalizedName = name.split(' ').join('-');

        cy.document().matchImageSnapshot(normalizedName, {
            ...defaultOptions,
            ...options,
            name: normalizedName
        });
    } else {
        // technically it is not a requirement for cypress but the code
        // changes we made for DPI invariable testing, need the test to have
        // a name so the script can find it every single time with certainity.
        // This can change in the future when Cypress develops DPI invariant
        // testing internally and incorporates into the code themselves.
        throw new Error('Please provide a name to be used for the test');
    }

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
