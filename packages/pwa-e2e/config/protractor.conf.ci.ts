import { setDefaultTimeout } from 'cucumber';
import { PerformanceObserver } from 'perf_hooks';
import { browser, Config } from 'protractor';

export const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((entrie) => {
        const casted: any = entrie;
        console.dir(`${casted[0].__proto__.constructor.name}.${entrie.name} ${entrie.duration} ms`);
    });
});
/*
The config folder includes all the configuration files
This example config file displays the basic protractor-cucumber framework configuration
ts-node compiler is needed for cucumberjs
tags option for specific scenarios added
**/
export let config: Config = {
    baseUrl: 'https://epam.com',

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--disable-popup-blocking', '--disable-translate', '--headless'],
            // mobileEmulation: {
            //     deviceName: 'Pixel 2',
            // },
        },
        shardTestFiles: true,
    },
    // These are various cucumber compiler options
    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        format: ['pretty', 'json:reports/report.json'],
        require: ['../../src/stepdefinitions/*.ts'],
        // tags help us execute specific scenarios of feature files
        tags: '',
    },
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // seleniumAddress: `http://${mobileConfig.PROJECT_NAME}:${mobileConfig.API_KEY}@${mobileConfig.APPIUM_HUB}/wd/hub`,
    // multiCapabilities: [
    //     {
    //         autoWebview: true,
    //         accessKey: mobileConfig.API_KEY,
    //         username: mobileConfig.PROJECT_NAME,
    //         browserName: mobileConfig.BROWSER_NAME,
    //         deviceName: mobileConfig.DEVICE_NAME,
    //         platformName: mobileConfig.PLATFORM_NAME,
    //         platformVersion: mobileConfig.PLATFORM_VERSION,
    //     },
    // ],
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    // This utility function helps prepare our scripts with required actions like browser maximize
    onPrepare: () => {
        obs.observe({ entryTypes: ['function'] });

        browser.waitForAngularEnabled(false);
        browser.ignoreSynchronization = true;
        setDefaultTimeout(60 * 1000);
        browser.driver.manage().window().setSize(1024, 768);
    },
    // tslint:disable-next-line:object-literal-sort-keys
    onComplete: () => {
        obs.disconnect();
        browser.quit();
    },

    specs: [
        '../../src/features/*.feature',
    ],

    plugins: [{
        package: 'protractor-multiple-cucumber-html-reporter-plugin',
        options: {
            // read the options part for more options
            automaticallyGenerateReport: true,
            removeExistingJsonReportFile: true,
        },
    }],

    // tslint:disable-next-line:object-literal-sort-keys
    webDriverLogDir: './logs',
    getPageTimeout: 2000000,
};
