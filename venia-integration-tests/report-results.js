#!/usr/bin/env node

let summary;

try {
    summary = require('./cypress-test-results.json');
} catch (e) {
    console.error(
        'Unable to retrieve Cypress results. Please re-run the tests.'
    );
    process.exit(1);
}

const processTests = (tests, testsFile) => {
    const failedMessages = tests
        .filter(test => test.fail)
        .map(test => `${testsFile} \n\n${test.title}: \n\n${test.err.estack}`);

    return failedMessages.join('\n');
};

const testFailures = summary.stats.failures;

const hasFailed = result => {
    return result.suites.some(suite => suite.failures.length > 0);
};

const getTestStatuses = result => {
    let passedTests = 0;
    let failedTests = 0;
    let totalDuration = 0;

    try {
        if (result.tests.length) {
            passedTests = passedTests + result.passes.length;
            failedTests = failedTests + result.failures.length;
            totalDuration = totalDuration + result.duration;
        }

        if (result.suites.length) {
            result.suites.forEach(suite => {
                if (suite.tests.length) {
                    passedTests = passedTests + suite.passes.length;
                    failedTests = failedTests + suite.failures.length;
                    totalDuration = totalDuration + suite.duration;
                }

                if (suite.suites.length) {
                    suite.suites.forEach(subSuite => {
                        const subSuiteResult = getTestStatuses(subSuite);

                        passedTests = passedTests + subSuiteResult.passedTests;
                        failedTests = failedTests + subSuiteResult.failedTests;
                        totalDuration =
                            totalDuration + subSuiteResult.totalDuration;
                    });
                }
            });
        }
    } catch (e) {
        console.error(e);
    }

    return {
        passedTests,
        failedTests,
        totalDuration
    };
};

const generateTestSummary = result => {
    const testName = result.suites[0].title;
    const { passedTests, failedTests, totalDuration } = getTestStatuses(result);

    return {
        Title: testName,
        Status: failedTests > 0 ? ' ❌ ' : ' ✅ ',
        Passed: passedTests,
        Failed: failedTests,
        Duration: totalDuration
    };
};

const parsedSummary = summary.results.map(generateTestSummary);

if (testFailures === 0) {
    // no test failures
    console.table(parsedSummary);
    console.log('\n');
    console.log('\x1b[32m', 'All Cypress tests passed 👍', '\x1b[0m', '\n\n');

    return;
} else {
    const failures = [];

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
    });

    const failSummary = failures.join(
        '\n\n -------------------------------- \n\n'
    );
    console.log('\x1b[43m', `${failures.length} failures`, '\x1b[0m', '\n\n');
    console.log('\x1b[31m', `${failSummary} \n\n`, '\x1b[0m');
    console.log('Cypress tests in the following files did not pass 😔 \n');
    console.table(parsedSummary);
}
