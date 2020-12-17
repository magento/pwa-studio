const { existsSync } = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const https = require('https');
const fetch = require('node-fetch');
const agent = new https.Agent({
    rejectUnauthorized: false
});

const fetchWithAgent = async url => {
    return await fetch(url, { agent });
};

const prettyLogger = require('../util/pretty-logger');
const { loadEnvironment } = require('../Utilities');

const { uniqBy } = require('lodash');
const { sampleBackends: defaultSampleBackends } = require('./create-project');

const removeDuplicateBackends = backendEnvironments =>
    uniqBy(backendEnvironments, 'url');

const fetchSampleBackendUrls = async () => {
    try {
        const res = await fetch(
            'https://fvp0esmt8f.execute-api.us-east-1.amazonaws.com/default/getSampleBackends'
        );
        const { sampleBackends } = await res.json();

        return removeDuplicateBackends([
            ...sampleBackends.environments,
            ...defaultSampleBackends.environments
        ]).map(({ url }) => url);
    } catch {
        return defaultSampleBackends.environments.map(({ url }) => url);
    }
};

const cwd = process.cwd();

function inspectDependencies(package) {
    prettyLogger.info('Inspecting Dependencies');

    // Inspect all '@magento/...' dependencies.
    const magentoDependencies = [
        ...Object.keys(package.dependencies),
        ...Object.keys(package.devDependencies)
    ].filter(dependency => dependency.startsWith('@magento/'));

    let dependencies;
    if (existsSync(path.resolve(cwd, 'yarn.lock'))) {
        // using yarn
        dependencies = getYarnDependencies(magentoDependencies);
        prettyLogger.log(
            `Found ${dependencies.size} @magento dependencies in yarn.lock`
        );
    } else if (existsSync(path.resolve(cwd, 'package-lock.json'))) {
        // using npm
        dependencies = getNpmDependencies(magentoDependencies);
        prettyLogger.log(
            `Found ${
                dependencies.size
            } @magento dependencies in package-lock.json`
        );
    } else {
        throw new Error(
            'Dependencies have not been installed, please run `yarn install` or npm install` then generate the build report again.'
        );
    }

    function logMapElements(value, key) {
        prettyLogger.log(`${key} @ ${value}`);
    }

    dependencies.forEach(logMapElements);
}

function getYarnDependencies(dependencies) {
    const dependencyMap = new Map();

    dependencies.map(packageName => {
        const whyBuffer = spawnSync('yarn', ['why', packageName]);
        const grepBuffer = spawnSync('grep', ['Found'], {
            input: whyBuffer.stdout
        });

        // [ 'info \r=> Found "@magento/pwa-buildpack@7.0.0"', '' ]
        const outputArray = grepBuffer.stdout.toString().split('\n');

        // [ '7.0.0' ]
        const parsedOutputArray = outputArray
            .filter(output => output.length > 0)
            .map(output => output.split('@')[2].replace('"', ''));

        dependencyMap.set(packageName, parsedOutputArray.toString());
    });

    return dependencyMap;
}

function getNpmDependencies(dependencies) {
    const dependencyMap = new Map();

    dependencies.map(packageName => {
        const listbuffer = spawnSync('npm', ['list', packageName]);
        const grepBuffer = spawnSync('grep', ['└──'], {
            input: listbuffer.stdout
        });

        // TODO: handle multiple versions installed when not dupe. ie "npm ls core-js"
        const [, , version] = grepBuffer.stdout
            .toString()
            .split('\n') // ["│ └── @magento/upward-js@5.0.0  deduped", "└── @magento/upward-js@5.0.0"]
            .filter(text => !text.includes('deduped'))[0] // ["└── @magento/upward-js@5.0.0"]
            .split('@'); // [ '└── ', 'magento/upward-js', '5.0.0' ]

        dependencyMap.set(packageName, version);
    });

    return dependencyMap;
}

async function inspectBackend() {
    prettyLogger.info('Inspecting Magento Backend');
    const [projectConfig, sampleBackends] = await Promise.all([
        loadEnvironment(
            // Load .env from root
            path.resolve(cwd)
        ),
        fetchSampleBackendUrls()
    ]);

    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const {
        env: { MAGENTO_BACKEND_URL }
    } = projectConfig;

    if (sampleBackends.includes(MAGENTO_BACKEND_URL)) {
        prettyLogger.log('Using sample backend: ', MAGENTO_BACKEND_URL);
    } else {
        prettyLogger.log('Not using sample backend.');
    }

    // Upcheck
    try {
        const res = await fetchWithAgent(MAGENTO_BACKEND_URL);
        prettyLogger.log('Backend is UP!');
    } catch (e) {
        prettyLogger.log('Backend is DOWN!');
        prettyLogger.error('Reason:', e);
    }

    // Backend Version
    try {
        const res = await fetchWithAgent(
            `${MAGENTO_BACKEND_URL}/magento_version`
        );
        prettyLogger.log('Magento Version:', await res.text());
    } catch (e) {
        prettyLogger.warn(
            'Unable to determine Magento version - ensure that the Magento_Version route is enabled when generating this report.'
        );
        prettyLogger.error('Reason:', e);
    }
    // https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/magento_version
}

function inspectBuildEnv() {
    prettyLogger.info('Inspecting System');
    prettyLogger.log('OS:', os.version());

    prettyLogger.log('Node Version:', process.version);
    const versionBuffer = spawnSync('npm', ['-v']);
    prettyLogger.log('NPM Version:', versionBuffer.stdout.toString());
}
/**
 * main
 */
async function buildpackCli() {
    const package = require(path.resolve(cwd, 'package.json'));
    prettyLogger.info(
        `Generating build report for ${package.name}@${
            package.version
        }. This may take a moment.`
    );
    prettyLogger.log('\n');

    inspectDependencies(package);

    prettyLogger.log('\n');

    await inspectBackend();

    prettyLogger.log('\n');

    inspectBuildEnv();

    prettyLogger.log('\n');
}

module.exports.command = 'generate-build-report';

module.exports.describe =
    'Generates a report of general build information that can be used when debugging an issue.';

module.exports.handler = buildpackCli;
