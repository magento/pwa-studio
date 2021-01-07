const { existsSync, readFileSync } = require('fs');
const { parse } = require('@yarnpkg/lockfile');
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
    const lockFile = readFileSync(path.resolve(cwd, 'yarn.lock'), 'utf8');
    const parsedLockFile = parse(lockFile);

    dependencies.map(packageName => {
        Object.keys(parsedLockFile.object)
            .filter(pkgName => pkgName.includes(packageName))
            .forEach(yarnPkgName => {
                const version = parsedLockFile.object[yarnPkgName].version;

                if (dependencyMap.has(packageName)) {
                    if (!dependencyMap.get(packageName).includes(version)) {
                        dependencyMap.set(yarnPkgName, [
                            ...dependencyMap.get(packageName),
                            version
                        ]);
                    }
                } else {
                    dependencyMap.set(packageName, [version]);
                }
            });
    });

    return dependencyMap;
}

function getNpmDependencies(dependencies) {
    const dependencyMap = new Map();
    const lockFile = require(path.resolve(cwd, 'package-lock.json'));

    // Inspecting direct dependencies
    dependencies.map(packageName => {
        const version = lockFile.dependencies[packageName].version;

        if (dependencyMap.has(packageName)) {
            if (!dependencyMap.get(packageName).includes(version)) {
                dependencyMap.set(packageName, [
                    ...dependencyMap.get(packageName),
                    version
                ]);
            }
        } else {
            dependencyMap.set(packageName, [version]);
        }
    });

    // Inspecting dependencies of dependencies
    Object.values(lockFile.dependencies).map(depConfig => {
        if (depConfig.dependencies) {
            Object.keys(depConfig.dependencies).map(depConfigDepName => {
                if (dependencies.includes(depConfigDepName)) {
                    const version =
                        depConfig.dependencies[depConfigDepName].version;

                    if (dependencyMap.has(depConfigDepName)) {
                        if (
                            !dependencyMap
                                .get(depConfigDepName)
                                .includes(version)
                        ) {
                            dependencyMap.set(depConfigDepName, [
                                ...dependencyMap.get(depConfigDepName),
                                version
                            ]);
                        }
                    } else {
                        dependencyMap.set(depConfigDepName, [version]);
                    }
                }
            });
        }
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
        await fetchWithAgent(MAGENTO_BACKEND_URL);
        prettyLogger.log('Backend is UP!');
    } catch (e) {
        prettyLogger.log('Backend is DOWN!');
        prettyLogger.error('Reason:', e);
    }
}

function inspectBuildEnv() {
    let osVersion;
    try {
        osVersion = os.version();
    } catch {
        // os.version() is only available from node 13.
        osVersion = 'Unable to fetch OS Version.';
    }
    const nodeVersion = process.version;
    const versionBuffer = spawnSync('npm', ['-v']);
    const npmVersion = versionBuffer.stdout.toString();

    prettyLogger.info('Inspecting System');
    prettyLogger.log('OS:', osVersion);
    prettyLogger.log('Node Version:', nodeVersion);
    prettyLogger.log('NPM Version:', npmVersion);
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
