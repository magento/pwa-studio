#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const glob = require('glob')
const exec = require('child_process').exec

const argv = yargs(hideBin(process.argv)).argv

const baseUrl = argv.baseUrl
const parallelRuns = argv.parallel || 1
const updateSnapshots = argv.updateSnapshots || false

if (!baseUrl) {
    console.error('Missing baseUrl. Please provide a baseUrl using the --baseUrl arg')

    return;
}

const files = glob.sync('./src/tests/**/*.spec.js')

const testsPerRun = files.length / parallelRuns
const dockerRuns = []

const port = new URL(baseUrl).port

let dockerCommand = null

if (port) {
    // run docker on local instance
    console.log(`Running tests on local instance ${baseUrl}`)

    dockerCommand = `docker run --rm --network host -v ${process.env.PWD}:/venia-integration-tests -w /venia-integration-tests --entrypoint=cypress cypress/included:8.3.1 run --browser chrome --config baseUrl=https://host.docker.internal:${port},screenshotOnRunFailure=false --config-file cypress.config.json --env updateSnapshots=${updateSnapshots} --headless`
} else {
    // run docker on remote instance
    console.log(`Running tests on remote instance ${baseUrl}`)

    dockerCommand = `docker run --rm -v ${process.env.PWD}:/venia-integration-tests -w /venia-integration-tests --entrypoint=cypress cypress/included:8.3.1 run --browser chrome --config baseUrl=${baseUrl},screenshotOnRunFailure=false --config-file cypress.config.json --env updateSnapshots=${updateSnapshots} --headless`
}

for (let i = 0; i < parallelRuns; i++) {
    const filesToTest = files.slice(testsPerRun * (i), testsPerRun * (i + 1))

    const run = exec(`${dockerCommand} --spec ${filesToTest.join(',')}`)

    run.stdout.on('data', (data) => {
        console.log(`docker run ${i + 1} stdout: ${data}`);
    });

    run.stderr.on('data', (data) => {
        console.error(`docker run ${i + 1} stderr: ${data}`);
    });

    run.on('close', (code) => {
        console.log(`docker run ${i + 1} exited with code ${code}`);
    });

    dockerRuns.push(run)
}
