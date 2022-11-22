const {defineConfig} = require('cypress')

module.exports = defineConfig({
    video: false,
    pageLoadTimeout: 30000,
    requestTimeout: 60000,
    defaultCommandTimeout: 30000,
    fixturesFolder: 'src/fixtures',
    screenshotsFolder: "src/snapshots",
    viewportHeight: 900,
    viewportWidth: 1440,
    scrollBehavior: 'nearest',
    trashAssetsBeforeRuns: false,
    chromeWebSecurity: false,
    retries: {
        runMode: 2,
    },
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            return require('./src/plugins/index.js')(on, config)
        },
        baseUrl: 'https://develop--helix-venia-jam--magento-comops.hlx.page/',
        supportFile: 'src/support/index.js',
        specPattern: 'src/tests/**/*.spec.js',
        excludeSpecPattern: ["**/__snapshots__/*", "**/__image_snapshots__/*"],
        defaultData_couponCode: "PWA1423",
        defaultData_giftCardNumber: "02Y0LCHUNDRZ",
        updateSnapshots: true,
        grepFilterSpecs: true,
        grepOmitFiltered: true
    }
})

