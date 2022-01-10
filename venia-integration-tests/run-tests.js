#!/usr/bin/env node

const glob = require('glob');
const { exec, execSync } = require('child_process');
const { rmSync } = require('fs');

var argv = require('yargs/yargs')(process.argv.slice(2))
    .option('url', {
        alias: 'baseUrl',
        demandOption: true,
        describe: 'Storefront application URL to run tests against',
        type: 'string',
        nargs: 1
    })
    .option('t', {
        alias: 'threads',
        default: 1,
        describe: 'Number of parallel runs',
        type: 'number',
        nargs: 1
    })
    .option('u', {
        alias: 'update',
        default: false,
        describe: 'Update snapshots',
        type: 'boolean'
    })
    .option('s', {
        alias: 'spec',
        default: null,
        describe: 'Spec files to run',
        type: 'string',
        nargs: 1
    })
    .option('h', {
        alias: 'help',
        describe: 'Show run-tests help'
    })
    .help('h', 'Show run-tests help')
    .version(false).argv;

const { baseUrl, threads, update, spec } = argv;

if (!baseUrl) {
    console.error(
        'Missing baseUrl. Please provide a baseUrl using the --baseUrl arg'
    );

    process.exit(1);
}

const files = spec ? spec.split(',') : glob.sync('./src/tests/**/*.spec.js');

const threadCount = Math.min(files.length, threads);
const testsPerRun = files.length / threadCount;
const dockerRuns = {};

const port = new URL(baseUrl).port;

let dockerCommand = null;

if (port) {
    // run docker on local instance
    console.log(`Running tests on local instance ${baseUrl}`);

    dockerCommand = `docker run --rm -v ${
        process.env.PWD
    }:/venia-integration-tests -w /venia-integration-tests --entrypoint=cypress cypress/included:8.3.1 run --browser chrome --config baseUrl=https://host.docker.internal:${port},screenshotOnRunFailure=false --config-file cypress.config.json --env updateSnapshots=${update} --headless --reporter mochawesome --reporter-options reportDir=cypress/results,overwrite=false,html=false,json=true`;
} else {
    // run docker on remote instance
    console.log(`Running tests on remote instance ${baseUrl}`);

    dockerCommand = `docker run --rm -v ${
        process.env.PWD
    }:/venia-integration-tests -w /venia-integration-tests --entrypoint=cypress cypress/included:8.3.1 run --browser chrome --config baseUrl=${baseUrl},screenshotOnRunFailure=false --config-file cypress.config.json --env updateSnapshots=${update} --headless --reporter mochawesome --reporter-options reportDir=cypress/results,overwrite=false,html=false,json=true`;
}

const start = process.hrtime();

// remove old test results
rmSync('cypress/results', { recursive: true, force: true });
rmSync('cypress-test-results.json', { force: true });

for (let i = 0; i < threadCount; i++) {
    const filesToTest = files.slice(testsPerRun * i, testsPerRun * (i + 1));

    const commandWithSpecFiles = `${dockerCommand} --spec ${filesToTest.join(
        ','
    )}`;

    console.log(`Running ${commandWithSpecFiles} \n`);

    const run = exec(commandWithSpecFiles);

    run.stdout.on('data', data => {
        if (data !== '\n' || data !== '\r' || data.trim() !== '') {
            console.log(`docker run ${i + 1} => ${data}`);
        }
    });

    run.stderr.on('data', data => {
        console.error(`docker run ${i + 1} => ${data}`);
    });

    run.on('close', code => {
        dockerRuns[i].completed = true;

        const timeTaken = process.hrtime(dockerRuns[i].started)[0];

        console.log(
            `docker run ${i +
                1} exited with ${code} code in ${timeTaken} seconds`
        );

        if (Object.values(dockerRuns).every(r => r.completed)) {
            // build final results json
            execSync(
                'mochawesome-merge cypress/results/*.json -o cypress-test-results.json'
            );

            const totalTime = process.hrtime(start)[0];

            console.log(`\nAll runs completed in ${totalTime} seconds\n`);

            process.exit();
        }
    });

    dockerRuns[i] = {
        process: run,
        completed: false,
        started: process.hrtime()
    };
}

process.on('SIGINT', function() {
    console.log('Received kill signal. Killing all cypress tests. \n');

    exec(
        "docker ps -a | awk '{ print $1,$2 }' | grep cypress/included | awk '{print $1 }' | xargs -I {} docker kill {}"
    );
});
