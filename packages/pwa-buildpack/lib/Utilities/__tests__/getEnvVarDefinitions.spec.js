jest.mock('../../BuildBus');
const BuildBus = require('../../BuildBus');

const baseEnvVarDefs = require('../../../envVarDefinitions.json');

const getEnvVarDefinitions = require('../getEnvVarDefinitions');

test('runs targets to get env var defs', () => {
    BuildBus.for.mockImplementationOnce(() => new BuildBus());
    BuildBus.prototype.getTargetsOf.mockImplementationOnce(() => ({
        envVarDefinitions: {
            call: defs => {
                defs.sections.push({ name: 'testSection', variables: [] });
            }
        }
    }));

    const returnedDefs = getEnvVarDefinitions('./project-dir');
    const returnedSections = returnedDefs.sections.map(s => s.name);
    expect(returnedSections).toContain('testSection');
    expect(returnedSections).toContain('Connecting to a Magento store');

    expect(BuildBus.for).toHaveBeenCalledWith('./project-dir');
});

test('uses base defs if targets fail or are unavailable', () => {
    BuildBus.for.mockImplementationOnce(() => {
        throw new Error('@magento/pwa-buildpack has not been declaredA;');
    });
    expect(getEnvVarDefinitions('./other-project-dir')).toMatchObject(
        baseEnvVarDefs
    );
});
