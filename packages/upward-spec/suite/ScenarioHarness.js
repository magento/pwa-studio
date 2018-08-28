const { promisify } = require('util');
const { resolve, basename } = require('path');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const mockGQLService = require('./MockGQLService');
const PhaseTester = require('./PhaseTester');

class ScenarioHarness {
    constructor(scenarioDir) {
        this.base = scenarioDir;
        this.upwardPath = resolve(this.base, 'upward.yml');
    }
    getName() {
        return (this.config && this.config.name) || basename(this.base);
    }
    async setup({ die }) {
        try {
            const config = JSON.parse(
                await readFile(resolve(this.base, 'scenario.json'))
            );
            this.config = config;
            this.env = Object.assign({}, process.env, config.env);
            if (config.mockService) {
                this.mockedService = await mockGQLService(config.mockedService);
                context.env.GRAPHQL_SERVICE_ENDPOINT = await this.mockedService.start();
            }
        } catch (e) {
            die(e);
        }
    }
    async runWith(parentTest, serverRunner) {
        parentTest.tearDown(() => this.teardown(parentTest));
        const phaseTester = new PhaseTester(
            this.upwardPath,
            this.env,
            serverRunner
        );
        const phases = Object.entries(this.config.phases);
        return Promise.all(
            phases.map(([phase, cases]) =>
                parentTest.test(`${this.getName()}: ${phase} phase`, subtest =>
                    phaseTester[phase](subtest, cases)
                )
            )
        );
    }
    async teardown(parentTest) {
        if (this.mockService) {
            await this.mockService.close();
        }
        parentTest.comment('teardown success');
        parentTest.end();
    }
}

module.exports = ScenarioHarness;
