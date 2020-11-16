jest.mock('../../BuildBus');
const BuildBus = require('../../BuildBus');

const runValidations = require('../runEnvValidators');

const context = 'some/valid/path';
const env = {};

test('should run validator targets', async () => {
    const initFn = jest.fn();
    const runValidationTargets = jest.fn();
    const getTargetsOfFn = jest.fn().mockReturnValueOnce({
        validateEnv: { promise: runValidationTargets }
    });
    const bus = {
        init: initFn,
        getTargetsOf: getTargetsOfFn
    };
    const forFn = jest.fn().mockReturnValue(bus);
    const enableTrackingFn = jest.fn();
    BuildBus.for.mockImplementationOnce(forFn);
    BuildBus.enableTracking.mockImplementationOnce(enableTrackingFn);

    const returnValue = await runValidations(context, env);

    expect(initFn).toHaveBeenCalled();
    expect(forFn).toHaveBeenCalledWith(context);
    expect(getTargetsOfFn).toHaveBeenCalledWith('@magento/pwa-buildpack');
    expect(runValidationTargets).toHaveBeenCalledWith({
        env: expect.any(Object),
        onFail: expect.any(Function),
        debug: expect.any(Function)
    });
    expect(returnValue).toBeTruthy();
});

test('should throw error if there are validation errors reported by interceptors', async () => {
    const initFn = jest.fn();
    const runValidationTargets = jest.fn().mockImplementation(({ onFail }) => {
        onFail('Danger');
        onFail(new Error('Another error'));
    });
    const getTargetsOfFn = jest.fn().mockReturnValueOnce({
        validateEnv: { promise: runValidationTargets }
    });
    const bus = {
        init: initFn,
        getTargetsOf: getTargetsOfFn
    };
    const forFn = jest.fn().mockReturnValue(bus);
    const enableTrackingFn = jest.fn();
    BuildBus.for.mockImplementationOnce(forFn);
    BuildBus.enableTracking.mockImplementationOnce(enableTrackingFn);

    try {
        const returnValue = await runValidations(context, env);

        expect(returnValue).toBeUndefined();
    } catch (e) {
        expect(e.message).toMatchSnapshot();
    }
});
