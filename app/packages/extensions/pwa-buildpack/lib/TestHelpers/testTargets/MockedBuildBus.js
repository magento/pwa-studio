/**
 * A mock BuildBus for testing target integrations. Instead of using the local
 * `package.json` to detect and order the pertaining dependencies, this takes
 * a set of pre-ordered dependencies that can include "virtual dependency"
 * objects.
 *
 * @module Buildpack/TestHelpers
 *
 */
const BuildBus = require('../../BuildBus/BuildBus');
const { ExplicitDependency, resolver } = require('pertain');
class MockedBuildBus extends BuildBus {
    /** @public */
    static clear() {
        throw new Error(
            'MockedBuildBus.clear() not supported. More details at https://twitter.com/JamesZetlen/status/1244683087839137792'
        );
    }
    /** @public */
    static clearAll() {
        throw new Error(
            'MockedBuildBus.clearAll() not supported. More details at https://twitter.com/JamesZetlen/status/1244683087839137792'
        );
    }
    /**
     * @public
     * @returns {BuildBus}
     */
    static for() {
        throw new Error(
            `MockedBuildBus.for() not supported. To create a MockedBuildBus, use mockBuildBus({ context, dependencies });

            More details at https://twitter.com/JamesZetlen/status/1244680322442280960`
        );
    }
    constructor(invoker, context, dependencies) {
        super(invoker, context);
        this._resolve = resolver(context);
        this._mockDependencies = dependencies;
    }
    _getEnvOverrides() {
        this._depsAdditional = [];
    }
    _getPertaining(phase) {
        /**
         * Always declare buildpack's base targets.
         * If the test declares Buildpack explicitly, don't declare it twice,
         * of course.
         */
        let buildpackDeclared = false;
        const pertaining = [];
        const addPertaining = dep => {
            if (dep.name === '@magento/pwa-buildpack') {
                buildpackDeclared = true;
            }
            pertaining.push(dep);
        };

        this._mockDependencies.forEach((dep, i) => {
            if (typeof dep === 'string') {
                const modulePath = this._resolve(dep);
                if (!modulePath) {
                    throw new Error(
                        `Dependency at index [${i}] is a string "${dep}", indicating a real node_module, but it could not be resolved as a node_module.`
                    );
                }
                const dependency = new ExplicitDependency(modulePath);
                const pertainingScript = dependency.pertains(
                    this._phaseToSubject(phase)
                );
                if (pertainingScript) {
                    addPertaining({
                        name: dep,
                        [phase]: require(pertainingScript)
                    });
                }
            } else if (
                typeof dep === 'object' &&
                typeof dep.name === 'string'
            ) {
                if (typeof dep[phase] === 'function') {
                    addPertaining(dep);
                }
            } else {
                throw new Error(
                    `${dep} is not a valid dependency. Dependencies argued to MockedBuildBus must be either the names of resolvable modules, or virtual dependencies (objects with a "name" string and "declare" and/or "intercept" functions).`
                );
            }
        });

        /** Ensure buildpack. */
        if (!buildpackDeclared) {
            pertaining.unshift({
                name: '@magento/pwa-buildpack',
                declare: require('../../BuildBus/declare-base'),
                intercept: require('../../BuildBus/intercept-base')
            });
        }
        return pertaining;
    }
    /**
     *
     * Get the names of the dependencies that were explicitly argued.
     * @returns {string[]}
     */
    getMockDependencyNames() {
        return this._mockDependencies.map(dep => dep.name || dep);
    }
}

module.exports = MockedBuildBus;
