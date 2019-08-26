jest.mock('../../util/pretty-logger', () => ({
    warn: jest.fn(),
    error: jest.fn()
}));
const dotenv = require('dotenv');
const createDotEnvFile = require('../createDotEnvFile');
const envVarDefs = require('../../../envVarDefinitions.json');
const prettyLogger = require('../../util/pretty-logger');

const examples = {};
for (const section of envVarDefs.sections) {
    for (const variable of section.variables) {
        if (variable.hasOwnProperty('example')) {
            examples[variable.name] = variable.example;
        }
    }
}

const mockLog = {
    warn: jest.fn(),
    error: jest.fn()
};

beforeEach(() => {
    prettyLogger.warn.mockClear();
    prettyLogger.error.mockClear();
    mockLog.warn.mockClear();
    mockLog.error.mockClear();
});

test('logs errors to default logger if env is not valid', () => {
    createDotEnvFile({});
    expect(prettyLogger.warn).toHaveBeenCalled();
});

test('uses alternate logger', () => {
    createDotEnvFile({}, { logger: mockLog });
    expect(mockLog.warn).toHaveBeenCalled();
});

test('returns valid dotenv file if env is valid', () => {
    const currentEnv = { MAGENTO_BACKEND_URL: 'https://local.magento/' };

    const fileText = createDotEnvFile(currentEnv, { logger: mockLog });
    expect(dotenv.parse(fileText)).toMatchObject(currentEnv);
});

test('populates with examples where available', () => {
    const fileText = createDotEnvFile({}, { useExamples: true });
    expect(dotenv.parse(fileText)).toMatchObject(examples);
});

test('does not print example comment if value is set custom', () => {
    const fileText = createDotEnvFile({
        MAGENTO_BACKEND_URL: 'https://other.magento.site',
        IMAGE_SERVICE_CACHE_EXPIRES: 'a million years'
    });
    expect(fileText).not.toMatch(examples.MAGENTO_BACKEND_URL);
    expect(fileText).not.toMatch(
        `Example: ${examples.IMAGE_SERVICE_CACHE_EXPIRES}`
    );
});
