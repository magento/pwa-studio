import { readdirSync } from 'fs';
import { readJsonSync } from 'fs-extra';
import { PerformanceObserver } from 'perf_hooks';
import { browser, Config } from 'protractor';

import { environment } from './environment';

// tslint:disable-next-line:no-var-requires
const { setDefaultTimeout } = require('cucumber');

export const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((entrie) => {
        const casted: any = entrie;
        console.dir(`${casted[0].__proto__.constructor.name}.${entrie.name} ${entrie.duration} ms`);
    });
});

const { prod, local } = environment;

export let config: Config = {
    baseUrl: process.env.NODE_ENV === 'production' ? prod.baseUrl : local.baseUrl,

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--disable-popup-blocking', '--disable-translate'],
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
        strict: true,
    },
    seleniumAddress: 'http://localhost:4444/wd/hub',

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
        const files = readdirSync(`${process.cwd()}/reports`);
        const file = readJsonSync(files[0]);
        // tslint:disable-next-line:max-line-length
        fetch('https://app.hiptest.com/import_test_reports/6840272904720785713380742150567002000442111232457875802/202890/cucumber-json', {
            method: 'POST',
            body: file,
        });
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
