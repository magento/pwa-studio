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
        browserName: 'firefox',
        maxInstances: 2,
        shardTestFiles: true,
    },
    // These are various cucumber compiler options
    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        format: ['pretty', 'json:reports/report.json'],
        require: ['../../stepdefinitions/*.ts'],
        // tags help us execute specific scenarios of feature files
        tags: '',
    },
    directConnect: true,

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    // seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    // This utility function helps prepare our scripts with required actions like browser maximize
    onPrepare: () => {
        obs.observe({ entryTypes: ['function'] });

        browser.waitForAngularEnabled(false);
        browser.driver.manage().window().maximize();
    },
    // tslint:disable-next-line:object-literal-sort-keys
    onComplete: () => {
        obs.disconnect();
    },

    specs: [
        '../../features/*.feature',
    ],

    plugins: [
        {
            options: {
                automaticallyGenerateReport: true,
                removeExistingJsonReportFile: true,
            },
            package: 'protractor-multiple-cucumber-html-reporter-plugin',
        },
    ],

    // tslint:disable-next-line:object-literal-sort-keys
    SELENIUM_PROMISE_MANAGER: false,
};