const createDotEnvFile = require('../createDotEnvFile');

const mockLog = {
    warn: jest.fn()
};

test('returns errors if env is not valid', () => {
    expect(createDotEnvFile({}, mockLog)).toHaveProperty('error');
    expect(mockLog.warn).toHaveBeenCalled();
});
