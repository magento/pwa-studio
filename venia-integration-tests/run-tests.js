#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const glob = require('glob')
const { exec, execSync } = require('child_process')

const argv = yargs(hideBin(process.argv)).argv

const baseUrl = argv.baseUrl
const parallelRuns = argv.parallel || 1
const updateSnapshots = argv.updateSnapshots || false
const spec = argv.spec || null

if (!baseUrl) {
    console.error('Missing baseUrl. Please provide a baseUrl using the --baseUrl arg')

    return;
}

const files = spec ? spec.split(',') : glob.sync('./src/tests/**/*.spec.js')

if (files.length < parallelRuns) {
    console.log('Can not have more parallel runs than tests.')

    return;
}

const testsPerRun = files.length / parallelRuns
const dockerRuns = {}

const port = new URL(baseUrl).port

let dockerCommand = null

if (port) {
    // run docker on local instance
    console.log(`Running tests on local instance ${baseUrl}`)

    dockerCommand = `docker run --rm -v ${process.env.PWD}:/venia-integration-tests -w /venia-integration-tests --entrypoint=cypress cypress/included:8.3.1 run --browser chrome --config baseUrl=https://host.docker.internal:${port},screenshotOnRunFailure=false --config-file cypress.config.json --env updateSnapshots=${updateSnapshots} --headless`
} else {
    // run docker on remote instance
    console.log(`Running tests on remote instance ${baseUrl}`)

    dockerCommand = `docker run --rm -v ${process.env.PWD}:/venia-integration-tests -w /venia-integration-tests --entrypoint=cypress cypress/included:8.3.1 run --browser chrome --config baseUrl=${baseUrl},screenshotOnRunFailure=false --config-file cypress.config.json --env updateSnapshots=${updateSnapshots} --headless`
}

const start = process.hrtime()

for (let i = 0; i < parallelRuns; i++) {
    const filesToTest = files.slice(testsPerRun * (i), testsPerRun * (i + 1))

    const commandWithSpecFiles = `${dockerCommand} --spec ${filesToTest.join(',')}`

    console.log(`Running ${commandWithSpecFiles} \n`)

    const run = exec(commandWithSpecFiles)

    run.stdout.on('data', (data) => {
        if (data !== '\n' || data !== '\r' || data.trim() !== '') {
            console.log(`docker run ${i + 1} => ${data}`);
        }
    });

    run.stderr.on('data', (data) => {
        console.error(`docker run ${i + 1} => ${data}`);
    });

    run.on('close', (code) => {
        dockerRuns[i].completed = true

        const timeTaken = process.hrtime(dockerRuns[i].started)[0]

        console.log(`docker run ${i + 1} exited with ${code} code in ${timeTaken} seconds`);

        if (Object.values(dockerRuns).every(r => r.completed)) {
            const totalTime = process.hrtime(start)[0]

            console.log(`\nAll runs completed in ${totalTime}\n`)

            process.exit()
        }
    });

    dockerRuns[i] = {
        process: run,
        completed: false,
        started: process.hrtime()
    }
}

process.on('SIGINT', function () {
    console.log('Received kill signal. Killing all cypress tests. \n');

    execSync("docker ps -a | awk '{ print $1,$2 }' | grep cypress/included | awk '{print $1 }' | xargs -I {} docker kill {}")
});