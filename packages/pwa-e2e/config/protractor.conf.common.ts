import { Config } from 'protractor';
import { environment } from './environment';
import { hooks } from './hooks';

const { stage, local } = environment;
const { onComplete, onPrepare } = hooks;

export let config: Config = {
    // baseUrl: envConfig.environment === 'production' ? envConfig.url :
    //     envConfig.environment === 'stage' ? stage.baseUrl : local.baseUrl,

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                '--disable-popup-blocking',
                '--disable-translate',
            ],
        },
        // shardTestFiles: true,
    },
    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        format: ['progress', 'pretty', 'json:reports/report.json'],
        require: ['../../src/stepdefinitions/*.ts'],
        tags: '',
        'no-colors': true,
    },
    debug: true,
    seleniumAddress: 'http://localhost:4444/wd/hub',

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    specs: [
        '../../src/features/*.feature',
    ],

    onPrepare,
    onComplete,

    plugins: [{
        package: 'protractor-multiple-cucumber-html-reporter-plugin',
        options: {
            automaticallyGenerateReport: true,
            removeExistingJsonReportFile: true,
        },
    }],

    webDriverLogDir: './logs',
    getPageTimeout: 2000000,
};
