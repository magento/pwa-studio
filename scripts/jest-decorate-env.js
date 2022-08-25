/**
 * This environment decorator forces any test files containing unhandled promise
 * rejections to fail. Without it, Node will warn the unhandled rejection as a
 * future error, but allow the test suite to pass (as of 10.x-12.x).
 *
 * We don't want that; even if the issue is just in the test and not the code,
 * an unhandled rejection _always_ means that the test isn't running correctly,
 * and it may be returning a false positive. So this environment file tracks
 * unhandled rejections that occurred during a test run, and then when the run
 * completes, it will throw a global exception if any unhandled promise
 * rejections occurred.
 *
 * Related links:
 * https://stackoverflow.com/questions/50121134/how-do-i-fail-a-test-in-jest-when-an-uncaught-promise-rejection-occurs Description of technique
 * https://github.com/facebook/jest/issues/3251 Jest repo issue
 * https://gitlab.com/gitlab-org/gitlab-foss/merge_requests/26424/diffs GitLab site source has a similar fix
 */

// Cleanly printing errors from Jest.
const { ErrorWithStack } = require('jest-util');

// A test may have several nested timeouts before the rejection occurs; this
// allows us to pop those async event loops a few times by awaiting a full
// event loop.
const tick = () => new Promise(setImmediate);

// We need to make this change for both `jsdom` and `node` environments, so
// this is actually a function which returns an extended class--that way, we
// can reuse the code for both environments.
module.exports = Base =>
    class RejectionHandlingEnv extends Base {
        constructor(config, context) {
            super(config, context);
            // Environment runs once per test file, so this is an array of all
            // unhandled rejections in one test file (not the whole test plan).
            this.unhandledRejections = [];

            // We can't reliably subscribe until _after_ the environment is set
            // up, but there is no handler for that in the environment. Instead,
            // we set a global and then subscribe in ./jest-catch-rejections.js,
            // which jest.config.js runs after environment setup using the
            // setupFilesAfterEnv config.
            this.global.promiseRejectionHandler = error =>
                this.unhandledRejections.push(error);
        }

        async teardown() {
            // wait four tickets for promises nested that deep
            await tick();
            await tick();
            await tick();
            await tick();

            const numUnhandled = this.unhandledRejections.length;

            if (numUnhandled > 0) {
                let msg = `${numUnhandled} unhandled Promise rejections in this file. Check each test to make sure all Promise rejections are handled. Promises rejected with:`;
                for (let i = 0; i < numUnhandled; i++) {
                    msg += ` [#${i + 1}: ${this.unhandledRejections[i]}]`;
                }
                // Fail the whole test suite. This will stop all test output
                // until the rejected promises are fixed.
                throw new ErrorWithStack(msg, RejectionHandlingEnv);
            }

            await super.teardown();
        }
    };
