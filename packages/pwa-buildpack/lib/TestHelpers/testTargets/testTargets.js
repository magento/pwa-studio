/**
 * Helper functions for running extension targets in tests.
 * @module Buildpack/TestHelpers
 */
const TargetProvider = require('../../BuildBus/TargetProvider');
const MockedBuildBus = require('./MockedBuildBus');

const unimplementedTargetFac = (requestor, requestedName) => {
    throw new Error(`${requestor.constructor.name} received request from "${
        requestor.name
    }" for external targets "${requestedName}", but no function was supplied for getting external targets.

    More details at https://twitter.com/JamesZetlen/status/1244680319267147783`);
};

/**
 * An object representing a dependency with targets that participates in a
 * build.
 * @typedef {Object} MockDependency
 * @property {string} name - Module name of the dependency.
 * @property {Function} declare - Declare function which will receive the simulated target provider.
 * @property {Function} intercept - Intercept function which will receive the simulated target provider.
 */

/**
 * Create a {@link TargetProvider} not bound to a {@link BuildBus}, for testing
 * declare and intercept functions in isolation.
 *
 * @param {string} name
 * @param {Function} [getExternalTargets] Function that returns any
 *   external TargetProviders. To test with an intercept function, which almost
 *   certainly will use external TargetProviders, you must supply a function
 *   here that returns them.
 * @param {Function} [loggingParent=() => {}] Will be called with detailed logging information.
 * @returns {TargetProvider}
 */
function mockTargetProvider(
    name,
    getExternalTargets = unimplementedTargetFac,
    loggingParent = () => {}
) {
    return new TargetProvider(loggingParent, name, getExternalTargets);
}

/**
 *
 * Create a mock BuildBus for testing target integrations. Instead of using the
 * local `package.json` to detect and order the pertaining dependencies, this
 * takes a set of pre-ordered dependencies that can include "virtual
 * dependency" objects.
 *
 * You may supply string module names to use the on-disk dependencies, or `{
 * name, declare, intercept }` objects to act as "virtual dependencies".
 *
 * The modules will be run in the order supplied; therefore, if you're testing
 * your own targets, they should come last in the list.
 *
 * @param {Object} setup
 * @param {string} setup.context - Project root, the directory from which
 *   MockedBuildBus will resolve any on-disk dependencies that are not mocked.
 * @param {Array.(string|MockDependency)} setup.dependencies - Dependencies to use. P
 * @returns {MockedBuildBus}
 */

const INVOKE_FLAG = Symbol.for('FORCE_BUILDBUS_CREATE_FACTORY');
function mockBuildBus({ context, dependencies }) {
    return new MockedBuildBus(INVOKE_FLAG, context, dependencies);
}

module.exports = {
    mockBuildBus,
    mockTargetProvider
};
