#!/usr/bin/env node

let summary;
const failures = [];

const processTests = (tests, testsFile) => {
    const failedMessages = tests.filter(test => test.fail).map(test => `${testsFile} \n\n ${test.title}: \n\n\t ${test.err.estack}`);

    return failedMessages.join('\n');
}

try {
    summary = require('./cypress-test-results.json');
} catch (e) {
    throw new Error('Unable to retrieve Cypress results. Please re-run the tests.')
}

const testFailures = summary.stats.failures;

const hasFailed = (result) => {
    return result.suites.some(suite => suite.failures.length > 0);
}

if (testFailures === 0) {
    // no test failures
    return;
} else {
    // test failures, lets document them
    const { results } = summary;

    results.filter(hasFailed).map(result => {
        if (result.tests.length) {
            // test failures
            failures.push(processTests(result.tests, result.fullFile));
        }
        if (result.suites.length) {
            // suite failures
            failures.push(
                result.suites
                    .filter(suite => suite.failures.length)
                    .map(suite => processTests(suite.tests, result.fullFile))
            );
        }
    })
}

const failSummary = failures.join('\n\n -------------------------------- \n\n')

if (failSummary) {
    console.error(
        'Cypress tests in the following files did not pass 😔. \n\n\n' +
        failures.length + ' failures \n\n\n' +
        failSummary + '\n\n'
    );
} else {
    console.log('Cypress tests passed 👍');
}