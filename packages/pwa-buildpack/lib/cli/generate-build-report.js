const prettyLogger = require('../util/pretty-logger');
const { existsSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { spawnSync } = require('child_process');

const cwd = process.cwd();

function inspectDependencies(package) {
    // Inspect all '@magento/...' dependencies.
    const magentoDependencies = [
        ...Object.keys(package.dependencies),
        ...Object.keys(package.devDependencies)
    ].filter(dependency => dependency.startsWith('@magento/'));

    let dependencies;
    if (existsSync(resolve(cwd, 'yarn.lock'))) {
        // using yarn
        dependencies = getNpmDependencies(magentoDependencies);
        prettyLogger.info(
            `Found ${dependencies.size} @magento dependencies in yarn.lock`
        );
    } else if (existsSync(resolve(cwd, 'package-lock.json'))) {
        // using npm
        dependencies = getNpmDependencies(magentoDependencies);
        prettyLogger.info(
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

    // TODO: fully implement. Couldn't get npm to run the script.
    dependencies.map(packageName => {
        const listbuffer = spawnSync('npm', ['list', packageName]);
        const grepBuffer = spawnSync('grep', ['└──'], {
            input: listbuffer.stdout
        });

        console.log(grepBuffer.stdout.toString());
        // [ 'info \r=> Found "@magento/pwa-buildpack@7.0.0"', '' ]
        // const outputArray = grepBuffer.stdout.toString().split('\n');

        // // [ '7.0.0' ]
        // const parsedOutputArray = outputArray
        //     .filter(output => output.length > 0)
        //     .map(output => output.split('@')[2].replace('"', ''));

        // dependencyMap.set(packageName, parsedOutputArray.toString());
    });

    return dependencyMap;
}

/**
 * main
 */
async function buildpackCli() {
    const package = require(resolve(cwd, 'package.json'));
    prettyLogger.info(
        `Generating build report for ${package.name}@${package.version}`
    );

    inspectDependencies(package);

    // TODO: Fetch sample backends and compare to .env backend
}

module.exports.command = 'generate-build-report';

module.exports.describe =
    'Generates a report of general build information that can be used when debugging an issue.';

module.exports.handler = buildpackCli;
