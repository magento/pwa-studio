const mobileConfig = {
    API_KEY: 'dd991312-21fe-476a-89cc-563287696da5',
    APPIUM_HUB: 'mobilecloud.epam.com:8080',
    BROWSER_NAME: 'chrome',
    DEVICE_NAME: 'SAMSUNG SM-G955F',
    PLATFORM_NAME: 'Android',
    PLATFORM_VERSION: '8.0.0',
    PROJECT_NAME: 'EPM-TSTF',
};

export let environment = {
    // Capabilities to be passed to the webdriver instance.
    baseUrl:
        'http://' + (process.env.HTTP_HOST || 'localhost') +
        ':' + (process.env.HTTP_PORT),

    capabilities: {
        browserName: (process.env.TEST_BROWSER_NAME || 'chrome'),
        version: (process.env.TEST_BROWSER_VERSION || 'ANY'),
    },

    mobileConfig,
};