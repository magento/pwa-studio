const createDotEnvFile = require('../createDotEnvFile');

const mockLog = {
    warn: jest.fn(),
    error: jest.fn()
};

test('logs errors if env is not valid', () => {
    createDotEnvFile({}, mockLog);
    expect(mockLog.warn).toHaveBeenCalled();
});

test('returns text if env is valid', () => {
    expect(
        createDotEnvFile(
            { MAGENTO_BACKEND_URL: 'https://local.magento/' },
            mockLog
        )
    ).toMatch(/MAGENTO_BACKEND_URL=https:\/\/local\.magento/);
});
